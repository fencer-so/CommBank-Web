import axios from 'axios'
// Ensure this matches your project structure for the static user data
import { user } from '../data/user'
import { Goal, Transaction, User } from './types'

/**
 * Switch between the Azure URL and localhost depending on your environment.
 * If you are running your .NET backend locally, change this to:
 * export const API_ROOT = 'http://localhost:5203'
 */
export const API_ROOT = 'https://fencer-commbank.azurewebsites.net'

/**
 * Fetches the current user profile from the backend
 */
export async function getUser(): Promise<User | null> {
  try {
    const response = await axios.get(`${API_ROOT}/api/User/${user.id}`)
    return response.data
  } catch (error: any) {
    console.error("Error fetching user:", error)
    return null
  }
}

/**
 * Fetches all transactions belonging to the current user
 */
export async function getTransactions(): Promise<Transaction[] | null> {
  try {
    const response = await axios.get(`${API_ROOT}/api/Transaction/User/${user.id}`)
    return response.data
  } catch (error: any) {
    console.error("Error fetching transactions:", error)
    return null
  }
}

/**
 * Fetches all goals belonging to the current user
 */
export async function getGoals(): Promise<Goal[] | null> {
  try {
    const response = await axios.get(`${API_ROOT}/api/Goal/User/${user.id}`)
    return response.data
  } catch (error: any) {
    console.error("Error fetching goals:", error)
    return null
  }
}

/**
 * Creates a new goal with a default name and current date
 */
export async function createGoal(): Promise<Goal | null> {
  try {
    const response = await axios.post(`${API_ROOT}/api/Goal`, {
      userId: user.id,
      name: "New Goal", // Providing a default name helps the backend
      targetDate: new Date(),
      targetAmount: 0,
    })
    return response.data
  } catch (error: any) {
    console.error("Error creating goal:", error)
    return null
  }
}

/**
 * Updates an existing goal (Task 3 Core Requirement)
 * This PUT request ensures your Icon changes persist in the Database.
 */
export async function updateGoal(goalId: string, updatedGoal: Goal): Promise<boolean> {
  try {
    // Sends the full goal object (including the new Icon field) to the server
    await axios.put(`${API_ROOT}/api/Goal/${goalId}`, updatedGoal)
    return true
  } catch (error: any) {
    console.error("Error updating goal:", error)
    return false
  }
}