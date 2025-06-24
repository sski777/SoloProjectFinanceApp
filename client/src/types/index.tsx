export type TransactionType = "income" | "expense";

export interface Transaction {
  auth0_id: string | undefined;
  type: TransactionType;
  amount: number;
  category: string;
  note?: string;
  date: string;
}
