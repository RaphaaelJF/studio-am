'use client'

const VISITOR_COOKIE_KEY = 'studio_vid'
const SESSION_STORAGE_KEY = 'studio_sid'
const SESSION_TIMESTAMP_KEY = 'studio_sid_ts'
const SESSION_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutos de inatividade

/**
 * Retorna ou cria um UUID v4 pseudônimo e anônimo para o visitante.
 * Não coleta PII (nem IP, nem nome, nem e-mail).
 */
export function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return ''

  try {
    let vid = localStorage.getItem(VISITOR_COOKIE_KEY)
    if (!vid || !isValidUUID(vid)) {
      vid = generateUUID()
      localStorage.setItem(VISITOR_COOKIE_KEY, vid)
    }
    return vid
  } catch {
    return generateUUID()
  }
}

/**
 * Retorna ou cria um session_id.
 * Expira após 30 minutos de inatividade cronometrada por timestamp.
 */
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return ''

  const now = Date.now()
  try {
    const sid = sessionStorage.getItem(SESSION_STORAGE_KEY)
    const lastActiveStr = sessionStorage.getItem(SESSION_TIMESTAMP_KEY)
    const lastActive = lastActiveStr ? parseInt(lastActiveStr, 10) : 0

    if (sid && isValidUUID(sid) && lastActive && (now - lastActive < SESSION_TIMEOUT_MS)) {
      // Sessão ainda válida: atualiza timestamp da última atividade
      sessionStorage.setItem(SESSION_TIMESTAMP_KEY, String(now))
      return sid
    }

    // Sessão expirou (>30min) ou não existia: cria nova
    const newSid = generateUUID()
    sessionStorage.setItem(SESSION_STORAGE_KEY, newSid)
    sessionStorage.setItem(SESSION_TIMESTAMP_KEY, String(now))
    return newSid
  } catch {
    return generateUUID()
  }
}

/**
 * Interpreta a origem (Referrer) da sessão de forma categorizada.
 */
export function getReferrerSource(): 'google' | 'instagram' | 'direct' | 'other' {
  if (typeof window === 'undefined') return 'direct'

  const ref = document.referrer.toLowerCase()
  if (!ref) return 'direct'
  if (ref.includes('google.')) return 'google'
  if (ref.includes('instagram.com') || ref.includes('l.instagram.com')) return 'instagram'
  
  // Se veio do mesmo domínio (navegação interna)
  try {
    const refUrl = new URL(ref)
    if (refUrl.hostname === window.location.hostname) {
      return 'direct'
    }
  } catch {}

  return 'other'
}

/**
 * Envia um evento analítico de forma desacoplada e assíncrona.
 * Usa navigator.sendBeacon se disponível, com fallback para fetch com keepalive.
 */
export function trackEvent(
  eventName: 'page_view' | 'project_view' | 'contact_click' | 'whatsapp_click' | 'instagram_click',
  options?: {
    path?: string
    projectId?: string | null
  }
) {
  if (typeof window === 'undefined') return

  const visitorId = getOrCreateVisitorId()
  const sessionId = getOrCreateSessionId()
  const path = options?.path || window.location.pathname || '/'
  const referrerSource = getReferrerSource()

  const payload = {
    event_name: eventName,
    path,
    project_id: options?.projectId || null,
    visitor_id: visitorId,
    session_id: sessionId,
    referrer_source: referrerSource,
  }

  const payloadStr = JSON.stringify(payload)

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([payloadStr], { type: 'application/json' })
      const sent = navigator.sendBeacon('/api/telemetry', blob)
      if (sent) return
    }
  } catch {}

  // Fallback para fetch assíncrono não-bloqueante
  fetch('/api/telemetry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payloadStr,
    keepalive: true,
  }).catch(() => {})
}

function isValidUUID(uuid: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid)
}

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback seguro caso crypto.randomUUID não esteja disponível
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
