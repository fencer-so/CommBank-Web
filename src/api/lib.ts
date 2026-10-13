
import axios from 'axios'
import { user } from '../data/user'
import { Goal, Transaction, User } from './types'

// Local Commonwealth Bank .NET backend
export const API_ROOT = 'http://localhost:5203'

// Get user information
export async function getUser(): Promise<User | null> {
  try {
    const response = await axios.get<User>(
      `${API_ROOT}/api/User/${user.id}`
    )
    return response.data
  } catch (error: any) {
    console.error('Failed to fetch user:', error)
    return null
  }
}

// Get transactions belonging to the user
export async function getTransactions(): Promise<Transaction[] | null> {
  try {
    const response = await axios.get<Transaction[]>(
      `${API_ROOT}/api/Transaction/User/${user.id}`
    )
    return response.data
  } catch (error: any) {
    console.error('Failed to fetch transactions:', error)
    return null
  }
}

// Get goals belonging to the user
export async function getGoals(): Promise<Goal[] | null> {
  try {
    const response = await axios.get<Goal[]>(
      `${API_ROOT}/api/Goal/User/${user.id}`
    )
    return response.data
  } catch (error: any) {
    console.error('Failed to fetch goals:', error)
    return null
  }
}

// Create a new goal
export async function createGoal(): Promise<Goal | null> {
  try {
    const response = await axios.post<Goal>(
      `${API_ROOT}/api/Goal`,
      {
        userId: user.id,
        targetDate: new Date(),
        icon: null,
      }
    )

    return response.data
  } catch (error: any) {
    console.error('Failed to create goal:', error)
    return null
  }
}

// Task 3: Update an existing goal using Axios PUT
export async function updateGoal(
  goalId: string,
  updatedGoal: Goal
): Promise<boolean> {
  try {
    // Sends the complete updated goal, including icon
    await axios.put(
      `${API_ROOT}/api/Goal/${goalId}`,
      updatedGoal,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    console.log('Goal updated successfully:', goalId)
    return true

  } catch (error: any) {
    console.error('Failed to update goal:', error)
    return false
  }
}
