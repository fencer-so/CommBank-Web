export interface Account {
  id: string
  number: number
  name: string
  balance: number
  accountType: AccountType
  applicationId: string
  transactionIds: string[]
}

export interface Application {
  id: string
  created: Date
  modified: Date
  accountType: AccountType
  applicationStatus: ApplicationStatus
  userId: string
}

export interface Goal {
  id: string
  name: string
  targetAmount: number
  balance: number
  targetDate: Date
  created: Date
  accountId: string
  transactionIds: string[]
  tagIds: string[]
  icon?: string;
}

export interface Tag {
  id: string
  name: string
}
