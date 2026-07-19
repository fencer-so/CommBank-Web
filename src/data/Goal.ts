export interface Goal {
    id: string;
    name: string;
    icon?: string;
    targetAmount: number;
    targetDate: string;
    balance: number;
    created: string;
    transactionIds: string[];
    tagIds: string[];
    userId: string;
}
