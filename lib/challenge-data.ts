export const TOTAL_DAYS = 75

export type CategoryId = "coding" | "fitness" | "nutrition" | "mind" | "recovery" | "finance" | "self-care"

export type IconName = "code" | "activity" | "salad" | "brain" | "moon" | "wallet" | "flower"

export interface ChallengeTask {
  id: string
  label: string
  hint?: string
}

export interface Category {
  id: CategoryId
  name: string
  icon: IconName
  summary: string
  tasks: ChallengeTask[]
}

export const CATEGORIES: Category[] = [
  {
    id: "coding",
    name: "Coding",
    icon: "code",
    summary: "Ship something every single day",
    tasks: [
      { id: "coding-deep-work", label: "2 hours of deep focus work", hint: "No notifications" },
      { id: "coding-algorithm", label: "Solve one algorithm problem" },
      { id: "coding-commit", label: "Push a commit to GitHub" },
      { id: "coding-read", label: "Read docs or a technical article", hint: "20 min" },
    ],
  },
  {
    id: "fitness",
    name: "Fitness",
    icon: "activity",
    summary: "Two sessions, one of them outdoors",
    tasks: [
      { id: "fitness-workout", label: "45 minute training session" },
      { id: "fitness-outdoor", label: "Second workout outdoors", hint: "Rain or shine" },
      { id: "fitness-steps", label: "Hit 10,000 steps" },
      { id: "fitness-mobility", label: "10 minutes of mobility work" },
    ],
  },
  {
    id: "nutrition",
    name: "Nutrition",
    icon: "salad",
    summary: "Fuel the work, no shortcuts",
    tasks: [
      { id: "nutrition-water", label: "Drink 3.8L of water" },
      { id: "nutrition-diet", label: "Stick to the meal plan", hint: "No cheat meals" },
      { id: "nutrition-protein", label: "Hit the daily protein target" },
      { id: "nutrition-alcohol", label: "Zero alcohol and added sugar" },
    ],
  },
  {
    id: "mind",
    name: "Mind",
    icon: "brain",
    summary: "Sharpen input, protect attention",
    tasks: [
      { id: "mind-read", label: "Read 10 pages of non-fiction" },
      { id: "mind-learn", label: "Study a new concept", hint: "30 min" },
      { id: "mind-journal", label: "Brain dump in the journal" },
      { id: "mind-scroll", label: "No social feeds before noon" },
    ],
  },
  {
    id: "recovery",
    name: "Recovery",
    icon: "moon",
    summary: "Rest is part of the protocol",
    tasks: [
      { id: "recovery-sleep", label: "Sleep 7+ hours" },
      { id: "recovery-screens", label: "Screens off 60 min before bed" },
      { id: "recovery-wake", label: "Wake at the target time" },
      { id: "recovery-rest", label: "20 minutes of intentional rest" },
    ],
  },
  {
    id: "finance",
    name: "Finance",
    icon: "wallet",
    summary: "Small daily reps compound",
    tasks: [
      { id: "finance-log", label: "Log every expense" },
      { id: "finance-impulse", label: "No impulse purchases" },
      { id: "finance-review", label: "Review the budget", hint: "5 min" },
      { id: "finance-save", label: "Move money to savings" },
    ],
  },
  {
    id: "self-care",
    name: "Self-Care",
    icon: "flower",
    summary: "Show up for yourself too",
    tasks: [
      { id: "care-meditate", label: "10 minutes of meditation" },
      { id: "care-routine", label: "Skincare and hygiene routine" },
      { id: "care-connect", label: "Reach out to someone you love" },
      { id: "care-photo", label: "Take the daily progress photo" },
    ],
  },
]

export const ALL_TASK_IDS: string[] = CATEGORIES.flatMap((category) => category.tasks.map((task) => task.id))

export const TASKS_PER_DAY = ALL_TASK_IDS.length
