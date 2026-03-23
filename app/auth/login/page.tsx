import { Suspense } from 'react'
import { Header } from '@/components/layout/Header'
import { AuthForm } from '@/components/auth/AuthForm'

export const metadata = {
  title: 'Sign In - FitlyAi',
  description: 'Sign in to your FitlyAi account to access your sleep resources and community.',
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">Loading...</div>}>
          <AuthForm mode="login" />
        </Suspense>
      </main>
    </div>
  )
}
