import { auth } from "@/plugins/axios";
import { AccessLevel } from "@/types/AccessLevel";
import { Category } from "@/types/Category";
import { ExpenseEnriched, ExpensesData } from "@/types/Expense";
import { Tag } from "@/types/Tag";
import { UserData } from "@/types/User";
import { User } from "@stytch/vanilla-js";
import { DateInstance } from "vuetify";

import { getUserAvatarUrl } from "./serverUrls";

export function timeout(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function fetchUserAvatar(
  user: User | UserData
): Promise<string | null> {
  const [provider] = user.providers;
  const avatarUrl = provider.profile_picture_url;

  try {
    const response = await auth.get(getUserAvatarUrl(), {
      params: {
        url: avatarUrl,
      },
      responseType: "blob",
    });

    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error("errors.AvatarFetchError", error);
  }

  return null;
}

export function hasAccess(
  requiredAccess: AccessLevel[],
  userAccess: AccessLevel[],
  operator: "AND" | "OR" = "AND"
) {
  if (operator === "AND") {
    requiredAccess.every((access) => userAccess.includes(access));
  }

  return requiredAccess.some((access) => userAccess.includes(access));
}

export function hashStringToNumber(str: string): number {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }

  return Math.abs(hash);
}

export function generateColorFromHash(str: string): string {
  const hash = hashStringToNumber(str);
  const r = (hash & 0xff0000) >> 16;
  const g = (hash & 0x00ff00) >> 8;
  const b = hash & 0x0000ff;

  return `rgb(${r}, ${g}, ${b})`;
}

export function formatDate(
  input: Date | string,
  format: string = "YYYY-MM-DD"
): string {
  const date = typeof input === "string" ? new Date(input) : input;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const formattedDate = format
    .replace("YYYY", year.toString())
    .replace("MM", month)
    .replace("DD", day);

  return formattedDate;
}

export function enrichExpenses({
  expenses,
  categories,
  tags,
}: ExpensesData): ExpenseEnriched[] {
  const categoryMap = new Map<string, Category>();
  const tagMap = new Map<string, Tag>();

  categories.forEach((category) => {
    categoryMap.set(category._id, category);
  });

  tags.forEach((tag) => {
    tagMap.set(tag._id, tag);
  });

  return expenses.map((expense) => {
    const category = categoryMap.get(expense.categoryId) as Category;
    const parentCategory = category.parentCategory
      ? categoryMap.get(category.parentCategory)
      : category;
    const tags = expense.tagIds
      .map((tagId) => tagMap.get(tagId))
      .filter(Boolean) as Tag[];

    return {
      expense,
      category,
      parentCategory,
      tags,
    } as ExpenseEnriched;
  });
}

export type GroupExpensesOptions = {
  sortBy?: "day" | "month";
  order?: "asc" | "desc";
};

export function groupExpensesByDate(
  expenses: ExpenseEnriched[],
  date: DateInstance,
  { sortBy = "day", order = "desc" }: GroupExpensesOptions = {}
) {
  const sortedExpenses = expenses.sort((a, b) => {
    const dateA = new Date(a.expense.date).getTime();
    const dateB = new Date(b.expense.date).getTime();
    return order === "asc" ? dateA - dateB : dateB - dateA;
  });

  return sortedExpenses.reduce(
    (groups: Record<string, ExpenseEnriched[]>, expense) => {
      const key =
        sortBy === "day"
          ? date.format(expense.expense.date, "normalDateWithWeekday")
          : date.format(expense.expense.date, "monthAndYear");

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(expense);

      return groups;
    },
    {}
  );
}

export function monthRange(
  dateValue: Date,
  dateAdapter: DateInstance
): { startDate: string; endDate: string } {
  const startDate = dateAdapter.startOfDay(
    dateAdapter.startOfMonth(dateValue)
  ) as Date;
  const endDate = dateAdapter.endOfDay(
    dateAdapter.endOfMonth(dateValue)
  ) as Date;

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
}

export function yearRange(
  dateValue: Date,
  dateAdapter: DateInstance
): { startDate: string; endDate: string } {
  const startDate = dateAdapter.startOfDay(
    dateAdapter.startOfYear(dateValue)
  ) as Date;
  const endDate = dateAdapter.endOfDay(
    dateAdapter.endOfYear(dateValue)
  ) as Date;

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
}

export function limitDecimals(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);

  return Math.round(value * factor) / factor;
}
