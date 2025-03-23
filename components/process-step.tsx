import type { ReactNode } from "react"

interface ProcessStepProps {
  number: number
  title: string
  description: string
  icon: ReactNode
}

export function ProcessStep({ number, title, description, icon }: ProcessStepProps) {
  return (
    <div className="relative flex flex-col items-center text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
        {number}
      </div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

