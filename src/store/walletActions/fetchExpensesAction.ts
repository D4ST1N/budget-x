import { handleServerError } from "@/helpers/handleServerError";
import { getExpensesUrl } from "@/helpers/serverUrls";
import { api } from "@/plugins/axios";
import { ExpensesFetchResponse } from "@/types/Expense";
import { ServerResponseError } from "@/types/ServerResponse";
import { AxiosResponse } from "axios";

export interface ExpensesFilters {
  startDate?: string;
  endDate?: string;
  categories?: string[];
  tags?: string[];
}

export async function fetchExpensesAction({
  walletId,
  filters,
}: {
  walletId: string;
  filters: ExpensesFilters;
}): Promise<ExpensesFetchResponse | null> {
  try {
    const response: AxiosResponse<ExpensesFetchResponse> = await api.get(
      getExpensesUrl(walletId),
      {
        params: filters,
      }
    );

    return response.data;
  } catch (error: ServerResponseError | any) {
    handleServerError(error);

    return null;
  }
}
