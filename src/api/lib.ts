import axios from 'axios'
import { user } from '../data/user'
import { Goal, Transaction, User } from './types'

export const API_ROOT = 'https://fencer-commbank.azurewebsites.net'

const api = axios.create({
  baseURL: API_ROOT,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function getUser(): Promise<User | null> {
  try {
    const response = await api.get(`/api/User/${user.id}`)
    return response.data
  } catch (error) {
    console.error('getUser API failed:', error)
    return null
  }
}

export async function getTransactions(): Promise<Transaction[] | null> {
  try {
    const response = await api.get(`/api/Transaction/User/${user.id}`)
    return response.data
  } catch (error) {
    console.error('getTransactions API failed:', error)
    return null
  }
}

export async function getGoals(): Promise<Goal[] | null> {
  try {
    const response = await api.get(`/api/Goal/User/${user.id}`)
    return response.data
  } catch (error) {
    console.error('getGoals API failed:', error)
    return null
  }
}

export async function createGoal(): Promise<Goal | null> {
  try {
    const response = await api.post('/api/Goal', {
      userId: user.id,
      targetDate: new Date(),
    })
    return response.data
  } catch (error) {
    console.error('createGoal API failed:', error)
    return null
  }
}

export async function updateGoal(goalId: string, updatedGoal: Goal): Promise<boolean> {
  try {
    await api.put(`/api/Goal/${goalId}`, updatedGoal)
    return true
  } catch (error) {
    console.error('updateGoal API failed:', error)
    return false
  }
}
