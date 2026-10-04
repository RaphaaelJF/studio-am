import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Allowlist estrita de eventos
const ALLOWED_EVENTS = new Set([
  'page_view',
  'project_view',
  'contact_click',
  'whatsapp_click',
  'instagram_click',
])

const ALLOWED_SOURCES = new Set(['google', 'instagram', 'direct', 'other'])
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export async function POST(request: NextRequest) {
  try {
    // 1. Limite de tamanho de payload para mitigar abuso
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength, 10) > 4096) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 })
    }

    const body = await request.json()

    // 2. Validação dos campos obrigatórios
    const eventName = typeof body.event_name === 'string' ? body.event_name.trim() : ''
    if (!ALLOWED_EVENTS.has(eventName)) {
      return NextResponse.json({ error: 'Invalid event_name' }, { status: 400 })
    }

    const path = typeof body.path === 'string' ? body.path.trim().slice(0, 500) : ''
    if (!path || !path.startsWith('/')) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    const visitorId = typeof body.visitor_id === 'string' ? body.visitor_id.trim() : ''
    if (!UUID_REGEX.test(visitorId)) {
      return NextResponse.json({ error: 'Invalid visitor_id' }, { status: 400 })
    }

    const sessionId = typeof body.session_id === 'string' ? body.session_id.trim() : ''
    if (!UUID_REGEX.test(sessionId)) {
      return NextResponse.json({ error: 'Invalid session_id' }, { status: 400 })
    }

    let referrerSource = typeof body.referrer_source === 'string' ? body.referrer_source.trim().toLowerCase() : 'other'
    if (!ALLOWED_SOURCES.has(referrerSource)) {
      referrerSource = 'other'
    }

    let projectId: string | null = null
    if (body.project_id && typeof body.project_id === 'string' && UUID_REGEX.test(body.project_id.trim())) {
      projectId = body.project_id.trim()
    }

    // 3. Chamada da RPC segura no Supabase a partir do servidor
    const supabase = await createClient()

    const { error: rpcError } = await supabase.rpc('record_analytics_event', {
      p_event_name: eventName,
      p_path: path,
      p_project_id: projectId,
      p_visitor_id: visitorId,
      p_session_id: sessionId,
      p_referrer_source: referrerSource,
    })

    if (rpcError) {
      console.error('[telemetry] RPC error:', rpcError.message)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('[telemetry] Unexpected error:', err)
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
