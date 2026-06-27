import axios from 'axios'
import { user } from '../data/user'
import { API_ROOT, getGoals } from './lib'
import { Goal } from './types'

jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('getGoals', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('calls GetGoalsForUser route and returns goals for the current user', async () => {
    const goals: Goal[] = [
      {
        id: 'goal-1',
        name: 'Holiday',
        targetAmount: 2500,
        balance: 100,
        targetDate: new Date('2027-01-01'),
        created: new Date('2026-01-01'),
        accountId: 'account-1',
        transactionIds: [],
        tagIds: [],
        icon: '🚀',
      },
      {
        id: 'goal-2',
        name: 'Emergency',
        targetAmount: 5000,
        balance: 800,
        targetDate: new Date('2027-06-01'),
        created: new Date('2026-02-01'),
        accountId: 'account-2',
        transactionIds: [],
        tagIds: [],
        icon: '🎯',
      },
    ]

    mockedAxios.get.mockResolvedValueOnce({ data: goals })

    const result = await getGoals()

    expect(mockedAxios.get).toHaveBeenCalledWith(`${API_ROOT}/api/Goal/User/${user.id}`)
    expect(result).not.toBeNull()

    for (const goal of result ?? []) {
      expect(goal).toEqual(expect.any(Object))
      expect(goal).toEqual(expect.objectContaining({ id: expect.any(String) }))
    }
  })

  it('returns null when request fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('request failed'))

    const result = await getGoals()

    expect(result).toBeNull()
  })
})
