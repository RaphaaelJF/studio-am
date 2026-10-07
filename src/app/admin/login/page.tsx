import LoginForm from './LoginForm'
import { isNameLoginEnabled } from '@/lib/auth/mode'

export default function LoginPage() {
  return <LoginForm isTestMode={isNameLoginEnabled()} />
}
