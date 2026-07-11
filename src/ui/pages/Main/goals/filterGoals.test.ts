import { filterGoalsBySearch } from './filterGoals'

describe('filterGoalsBySearch', () => {
  const goals = [
    { id: '1', name: 'Holiday', targetAmount: 5000, balance: 1500, targetDate: new Date('2026-12-31'), created: new Date('2025-01-01'), accountId: 'acct-1', transactionIds: [], tagIds: [] },
    { id: '2', name: 'Emergency Fund', targetAmount: 1200, balance: 300, targetDate: new Date('2026-06-30'), created: new Date('2025-01-01'), accountId: 'acct-1', transactionIds: [], tagIds: [] },
  ]

  it('matches goals by name and target amount', () => {
    expect(filterGoalsBySearch(goals as any, 'holiday')).toEqual([goals[0]])
    expect(filterGoalsBySearch(goals as any, '1200')).toEqual([goals[1]])
    expect(filterGoalsBySearch(goals as any, '$5,000')).toEqual([goals[0]])
  })
})
