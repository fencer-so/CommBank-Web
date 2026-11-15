import goalsReducer, { createGoal, updateGoal, GoalsState } from './goalsSlice'
import { Goal } from '../api/types'

describe('goalsSlice', () => {
  const initialGoal: Goal = {
    id: '62a3f587102e921da1253d32',
    name: 'House Down Payment',
    targetAmount: 100000,
    balance: 73501.82,
    targetDate: new Date('2025-01-08T05:00:00Z'),
    created: new Date('2022-06-11T01:53:10.857Z'),
    accountId: '1',
    transactionIds: [],
    tagIds: [],
    icon: null,
  }

  it('should handle initial state', () => {
    expect(goalsReducer(undefined, { type: 'unknown' })).toEqual({
      map: {},
      list: [],
    })
  })

  it('should create a goal with null icon', () => {
    const state = goalsReducer(undefined, createGoal(initialGoal))
    expect(state.list).toContain(initialGoal.id)
    expect(state.map[initialGoal.id].icon).toBeNull()
  })

  it('should update a goal with an emoji icon', () => {
    const prevState: GoalsState = {
      map: { [initialGoal.id]: initialGoal },
      list: [initialGoal.id],
    }

    const updatedGoal: Goal = {
      ...initialGoal,
      icon: '🤺',
    }

    const state = goalsReducer(prevState, updateGoal(updatedGoal))
    expect(state.map[initialGoal.id].icon).toBe('🤺')
    expect(state.map[initialGoal.id].name).toBe('House Down Payment')
    expect(state.map[initialGoal.id].targetAmount).toBe(100000)
  })

  it('should allow changing an existing emoji icon', () => {
    const prevState: GoalsState = {
      map: {
        [initialGoal.id]: {
          ...initialGoal,
          icon: '🤺',
        },
      },
      list: [initialGoal.id],
    }

    const changedGoal: Goal = {
      ...initialGoal,
      icon: '🏠',
    }

    const state = goalsReducer(prevState, updateGoal(changedGoal))
    expect(state.map[initialGoal.id].icon).toBe('🏠')
  })
})
