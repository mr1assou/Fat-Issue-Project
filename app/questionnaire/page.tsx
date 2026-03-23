import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { QuestionnaireForm } from '@/components/questionnaire/QuestionnaireForm'
import { Moon } from 'lucide-react'

export const metadata = {
  title: 'Sleep Assessment - DreamWell',
  description: 'Take our personalized sleep assessment to discover your unique sleep profile and get customized recommendations.',
}

export default function QuestionnairePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center justify-center rounded-full bg-accent/10 p-3">
              <Moon className="h-8 w-8 text-accent" />
            </div>
            <h1 className="font-serif text-3xl font-semibold text-foreground sm:text-4xl">
              Sleep Assessment
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Answer a few questions about your sleep habits and lifestyle. This will help us create your personalized sleep improvement plan.
            </p>
          </div>

          {/* Form */}
          <QuestionnaireForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
