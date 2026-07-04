// src/api/types.ts

// 👇 Add User type
export interface User {
    id: string;
    name: string;
    email: string;
    // Add any other user fields your app uses
}

// 👇 Update Goal type with all fields
export interface Goal {
    id: string;
    name: string;
    targetAmount: number;
    targetDate: Date;
    balance: number;
    created: Date;
    accountId: string;
    transactionIds: string[];
    tagIds: string[];
    icon?: string;  // 👈 Your new field!
}

// 👇 Update Transaction with all fields
export interface Transaction {
    id: string;
    amount: number;
    description: string;
    date: Date;
    dateTime: string;      // 👈 Added for displaying date
    transactionType: 'Credit' | 'Debit';  // 👈 Added for transaction type
    goalId?: string;
    tagIds: string[];      // 👈 Added for tags
    // Add any other transaction fields your app uses
}

// 👇 Add Tag type
export interface Tag {
    id: string;
    name: string;
    color?: string;
    // Add any other tag fields your app uses
}

// 👇 Update ModalContent to accept Goal or any other content
export type ModalContent = Goal | Transaction | User | any;

// 👇 Update ModalType to include 'Goal'
export type ModalType = 'info' | 'warning' | 'error' | 'success' | 'confirm' | 'Goal';