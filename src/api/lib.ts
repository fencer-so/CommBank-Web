import axios from 'axios'
import { user } from '../data/user'
import { Goal, Transaction, User } from './types'

export const API_ROOT = 'https://fencer-commbank.azurewebsites.net'

export async function getUser(): Promise<User | null> {
  try {
    const response = await axios.get(`${API_ROOT}/api/User/${user.id}`)
    return response.data
  } catch (error: any) {
    return null
  }
}

export async function getTransactions(): Promise<Transaction[] | null> {
  try {
    const response = await axios.get(`${API_ROOT}/api/Transaction/User/${user.id}`)
    return response.data
  } catch (error: any) {
    return null
  }
}

export async function getGoals(): Promise<Goal[] | null> {
  try {
    const response = await axios.get(`${API_ROOT}/api/Goal/User/${user.id}`)
    return response.data
  } catch (error: any) {
    return null
  }
}

export async function createGoal(goal: Goal): Promise<Goal | null> {
  try {
    const response = await axios.post(`${API_ROOT}/api/Goal`, goal)
    return response.data
  } catch (error: any) {
    return null
  }
}

export async function updateGoal(id: string, goal: Goal): Promise<Goal | null> {
  try {
    const response = await axios.put(`${API_ROOT}/api/Goal/${id}`, goal)
    return response.data
  } catch (error: any) {
    return null
  }
}
