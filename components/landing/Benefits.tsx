import Image from 'next/image'
import { Moon, Brain, Heart, Zap, Users, BookOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const benefits = [
  {
    icon: Moon,
    title: 'Personalized Sleep Plans',
    description: 'Get a customized sleep improvement plan based on your unique sleep patterns and lifestyle.',
  },
  {
    icon: Brain,
    title: 'Science-Backed Methods',
    description: 'Our recommendations are grounded in sleep science and cognitive behavioral therapy principles.',
  },
  {
    icon: Heart,
    title: 'Holistic Wellness',
    description: 'Address the root causes of poor sleep with guidance on stress, nutrition, and exercise.',
  },
  {
    icon: Zap,
    title: 'Quick Results',
    description: 'Many users report improved sleep quality within the first two weeks of following their plan.',
  },
  {
    icon: Users,
    title: 'Supportive Community',
    description: 'Connect with others on their sleep journey and share tips, wins, and encouragement.',
  },
  {
    icon: BookOpen,
    title: 'Expert Resources',
    description: 'Access our comprehensive eBook and educational content to deepen your understanding.',
  },
]

export function Benefits() {
  return (
    <section className="bg-secondary/30 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header with Image */}
        <div className="mb-16 grid items-center gap-12 lg:grid-cols-2">
   
          <div className="order-1 lg:order-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src="/images/sleep-struggle-man.png"
                  alt="Man struggling to sleep"
                  width={280}
                  height={350}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-2xl shadow-lg mt-6">
                <Image
                  src="/images/sleep-awake-woman.png"
                  alt="Woman lying awake at night"
                  width={280}
                  height={350}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
              We Understand Your Sleep Struggles
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Millions of people lie awake at night, watching the clock tick away. The frustration of not being able to fall asleep affects every aspect of your life. We have been there too, and that is why we created DreamWell.
            </p>
            <p className="mt-4 text-muted-foreground">
              Our comprehensive approach addresses every aspect of sleep health, from daily habits to your sleep environment.
            </p>
          </div>
        </div>

        {/* Benefits Grid */}
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
