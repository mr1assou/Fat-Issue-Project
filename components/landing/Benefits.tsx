import Image from 'next/image'
import { Moon, Brain, Heart, Zap, Users, BookOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const benefits = [
  {
    icon: Moon,
    title: 'Personalized Fat-Loss Plans',
    description: 'Get a customized fat-loss strategy based on your habits, schedule, and goals.',
  },
  {
    icon: Brain,
    title: 'Science-Backed Methods',
    description: 'Our recommendations are built on evidence-based nutrition and behavior change principles.',
  },
  {
    icon: Heart,
    title: 'Holistic Wellness',
    description: 'Address the root causes of stubborn belly fat with guidance on stress, nutrition, and exercise.',
  },
  {
    icon: Zap,
    title: 'Steady, Real Results',
    description: 'Many users notice progress within the first two weeks when following the plan consistently.',
  },
  {
    icon: Users,
    title: 'Chatbot for Personalized Plan',
    description: 'Ask anytime. Get instant guidance, meal and habit suggestions, and a plan built around your stubborn belly fat goals.',
  },
  {
    icon: BookOpen,
    title: 'Expert Resources',
    description: 'Access our guided eBook and educational content to deepen your understanding.',
  },
]

export function Benefits() {
  return (
    <section className="bg-secondary/30 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header with Image */}
        <div className="mb-16 grid items-center gap-12 lg:grid-cols-2">
   
          <div className="order-2 sm:order-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src="/images/fat_struggle_man.png"
                  alt="Person struggling with stubborn belly fat"
                  width={280}
                  height={350}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-2xl shadow-lg mt-6">
                <Image
                  src="/images/fat_struggle_women.png"
                  alt="Person working on reducing stubborn belly fat"
                  width={280}
                  height={350}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
          <div className="order-1 sm:order-2">
            <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
              We Understand Your Stubborn Belly Fat
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              If you have tried everything and still feel stuck around the belly, you are not alone. That frustration can affect your confidence and energy. We built FitlyAi to help you take real steps toward a lighter, more comfortable body.
            </p>
            <p className="mt-4 text-muted-foreground">
              Our approach focuses on the habits and routines that support stubborn belly fat loss, from daily choices to lifestyle factors that help you stay consistent.
            </p>
          </div>
        </div>

        {/* Fat-Loss Benefits Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <Card
              key={benefit.title}
              className="group border-border/50 bg-card backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
