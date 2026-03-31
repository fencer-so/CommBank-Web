export interface Goal {
  id: string
  name: string
  targetDate: Date
  targetAmount: number
  balance: number
  created: Date
  accountId: string
  transactionIds: string[]
  tagIds: string[]
  icon?: string
}
export interface Goal {
  id: string
  name: string
  targetDate: Date
  targetAmount: number
  balance: number
  created: Date
  accountId: string
  transactionIds: string[]
  tagIds: string[]
  icon?: string   // add this line
}