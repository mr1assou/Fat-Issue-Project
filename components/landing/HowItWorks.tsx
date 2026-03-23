import { ClipboardList, BarChart3, Rocket } from 'lucide-react'

const steps = [
  {
    icon: ClipboardList,
    step: '01',
    title: 'Take the Fat-Loss Assessment',
    description: 'Answer a few questions about your belly fat triggers, routine, and goals. It only takes 5 minutes.',
  },
  {
    icon: BarChart3,
    step: '02',
    title: 'Get Your Body-Fat Profile',
    description: 'Receive a clear breakdown of what’s keeping stubborn belly fat around and personalized recommendations.',
  },
  {
    icon: Rocket,
    step: '03',
    title: 'Transform Your Stubborn Belly Fat',
    description: 'Follow your customized plan and track your progress as your belly feels lighter over time.',
  },
]

export function HowItWorks() {
  return (
    <section className="bg-background px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-semibold text-foreground sm:text-4xl">
            How It Works for Fat Loss
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Your journey to reduce stubborn belly fat starts with three simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {steps.map((item, index) => (
            <div key={item.title} className="relative">
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="absolute right-0 top-16 hidden h-0.5 w-full translate-x-1/2 bg-border lg:block" />
              )}

              <div className="relative flex flex-col items-center text-center">
                {/* Step number and icon */}
                <div className="relative">
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-secondary">
                    <item.icon className="h-12 w-12 text-accent" />
                  </div>
                  <div className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {item.step}
                  </div>
                </div>

                {/* Content */}
                <h3 className="mt-6 text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="mt-3 max-w-xs text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
