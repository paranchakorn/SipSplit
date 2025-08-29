
export interface Member {
  id: string;
  name: string;
  color: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidById: string;
  participants: string[]; // array of member ids
}

export interface Bill {
  id: string;
  title: string;
  members: Member[];
  expenses: Expense[];
}

export interface Balance {
  member: Member;
  amount: number; // positive if owed, negative if owes
}

export interface Settlement {
  from: Member;
  to: Member;
  amount: number;
}