import axios from 'axios'
import { user } from '../data/user'
import { Goal, Transaction, User } from './types'

export const API_ROOT = 'https://fencer-commbank.azurewebsites.net'

const axiosInstance = axios.create({
  timeout: 5000,
})

export async function getUser(): Promise<User | null> {
  try {
    const response = await axiosInstance.get(`${API_ROOT}/api/User/${user.id}`)
    return response.data
  } catch (error: any) {
    console.error('Failed to fetch user:', error.message)
    return null
  }
}

export async function getTransactions(): Promise<Transaction[] | null> {
  try {
    const response = await axiosInstance.get(`${API_ROOT}/api/Transaction/User/${user.id}`)
    return response.data
  } catch (error: any) {
    console.error('Failed to fetch transactions:', error.message)
    return null
  }
}

export async function getGoals(): Promise<Goal[] | null> {
  try {
    const response = await axiosInstance.get(`${API_ROOT}/api/Goal/User/${user.id}`)
    return response.data
  } catch (error: any) {
    console.error('Failed to fetch goals:', error.message)
    return null
  }
}

export async function createGoal(): Promise<Goal | null> {
  try {
    const response = await axiosInstance.post(`${API_ROOT}/api/Goal`, {
      userId: user.id,
      targetDate: new Date(),
    })
    return response.data
  } catch (error: any) {
    console.error('Failed to create goal:', error.message)
    return null
  }
}

export async function updateGoal(goalId: string, updatedGoal: Goal): Promise<boolean> {
  try {
    await axiosInstance.put(`${API_ROOT}/api/Goal/${goalId}`, updatedGoal)
    return true
  } catch (error: any) {
    console.error('Failed to update goal:', error.message)
    return false
  }
}
