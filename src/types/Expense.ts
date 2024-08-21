import { Category } from "./Category";
import { SuccessServerResponse } from "./ServerResponse";
import { Tag } from "./Tag";

export interface ExpenseData {
  categoryId: string;
  tagIds: string[];
  amount: number;
  date: Date;
}

export interface Expense extends ExpenseData {
  walletId: string;
  _id: string;
  __v: number;
}

export interface ExpensesData {
  expenses: Expense[];
  categories: Category[];
  tags: Tag[];
}

export interface SuccessWalletExpensesFetchResponse
  extends SuccessServerResponse,
    ExpensesData {}
