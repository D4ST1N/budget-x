import { handleServerError } from "@/helpers/handleServerError";
import { addExpensesBulkUrl } from "@/helpers/serverUrls";
import { api } from "@/plugins/axios";
import { ExpenseData, ExpensesCreationResponse } from "@/types/Expense";
import { ServerResponseError } from "@/types/ServerResponse";
import { AxiosResponse } from "axios";

export async function createExpensesBulkAction({
  walletId,
  expenses,
}: {
  walletId: string;
  expenses: ExpenseData[];
}): Promise<ExpensesCreationResponse | null> {
  try {
    const response: AxiosResponse<ExpensesCreationResponse> = await api.post(
      addExpensesBulkUrl(walletId),
      { expenses }
    );

    return response.data;
  } catch (error: ServerResponseError | any) {
    handleServerError(error);

    return null;
  }
}
