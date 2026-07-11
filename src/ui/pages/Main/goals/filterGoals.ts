import { Goal } from '../../../../api/types'

export function filterGoalsBySearch(goals: Goal[], query: string) {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return goals
  }

  return goals.filter((goal) => {
    const name = goal.name?.toLowerCase() ?? ''
    const amount = goal.targetAmount?.toString() ?? ''
    const formattedAmount = new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      maximumFractionDigits: 0,
    })
      .format(goal.targetAmount)
      .toLowerCase()

    return name.includes(normalizedQuery) || amount.includes(normalizedQuery) || formattedAmount.includes(normalizedQuery)
  })
}
