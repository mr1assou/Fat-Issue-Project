import { Suspense } from 'react'
import { Header } from '@/components/layout/Header'
import { AuthForm } from '@/components/auth/AuthForm'

export const metadata = {
  title: 'Create Account - DreamWell',
  description: 'Create your DreamWell account and start your journey to better sleep.',
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">Loading...</div>}>
          <AuthForm mode="register" />
        </Suspense>
      </main>
    </div>
  )
}
