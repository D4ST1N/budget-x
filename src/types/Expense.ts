import { Category } from "./Category";
import { Tag } from "./Tag";

export interface ExpenseData {
  categoryId: string;
  tagIds: string[];
  amount: number;
  date: Date;
  isIncome: boolean;
}

export type ExpenseEditData = Pick<
  ExpenseData,
  "categoryId" | "amount" | "date"
> & {
  tagNames: string[];
};

export interface Expense extends ExpenseData {
  walletId: string;
  _id: string;
  __v: number;
}

export interface ExpenseEnriched {
  expense: Expense;
  category: Category;
  parentCategory: Category;
  tags: Tag[];
}

export interface ExpensesData {
  expenses: Expense[];
  categories: Category[];
  tags: Tag[];
}

export interface ExpenseCreationResponse {
  expense: Expense;
}

export interface ExpensesCreationResponse {
  expenses: Expense[];
}

export interface ExpenseUpdateResponse {
  expense: Expense;
}

export interface ExpensesFetchResponse extends ExpensesData {}

export interface TransferExpensesResponse {
  expensesCount: number;
}

export interface DeleteExpensesBulkResponse {
  deletedCount: number;
}
