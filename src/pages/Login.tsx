import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { trpc } from '@/providers/trpc'
import { useLanguage } from '@/context/LanguageProvider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

/**
 * Admin sign-in — portable email/password login.
 * Credentials live only in server-side environment variables
 * (ADMIN_EMAIL / ADMIN_PASSWORD); the session is a secure HTTP-only cookie.
 */
export default function Login() {
  const { t, lang } = useLanguage()
  const navigate = useNavigate()
  const utils = trpc.useUtils()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async () => {
      await utils.invalidate()
      navigate('/admin')
    },
    onError: () => setError(t.login.error),
  })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    loginMutation.mutate({ email, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center space-y-3">
          <img
            src="/yashfeen-mark.png"
            alt="Yashfeen"
            className="mx-auto h-14 w-14 object-contain dark:hidden"
          />
          <img
            src="/yashfeen-mark-dark.png"
            alt="Yashfeen"
            className="mx-auto h-14 w-14 object-contain hidden dark:block"
          />
          <CardTitle className="text-2xl">{t.login.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{t.login.subtitle}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t.login.email}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                required
                dir="ltr"
                placeholder={t.login.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t.login.password}</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                dir="ltr"
                placeholder={t.login.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <p role="alert" className="text-sm font-medium text-destructive">
                {error}
              </p>
            )}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? t.login.submitting : t.login.submit}
            </Button>
            <div className="text-center">
              <Link
                to="/"
                className="text-sm text-muted-foreground underline-offset-4 hover:underline"
              >
                {t.login.backToSite}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
      <span className="sr-only">{lang}</span>
    </div>
  )
}
