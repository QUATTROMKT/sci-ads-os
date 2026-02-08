export interface Client {
    id: string;
    companyName: string;
    decisionMaker: string;
    niche: string;
    driveLink?: string;
    startDate: string;
    status: 'active' | 'churn' | 'negotiation';
    ltv?: string; // Formatted currency string
    contractValue?: string; // Monthly value
    contractDuration?: string; // Number of months
}

export type TaskStatus = 'todo' | 'in-progress' | 'waiting' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
    id: string;
    clientId: string;
    clientName: string;
    title: string;
    description?: string;
    dueDate: string;
    priority: TaskPriority;
    status: TaskStatus;
    tags?: string[];
}

export interface Invoice {
    id: string;
    clientId: string;
    clientName: string;
    amount: string;
    dueDate: string;
    status: 'paid' | 'pending' | 'overdue';
}
