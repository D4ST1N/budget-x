import { handleServerError } from "@/helpers/handleServerError";
import { updateExpenseUrl } from "@/helpers/serverUrls";
import { api } from "@/plugins/axios";
import { ExpenseData, ExpenseUpdateResponse } from "@/types/Expense";
import { ServerResponseError } from "@/types/ServerResponse";
import { AxiosResponse } from "axios";

export async function updateExpenseAction({
  walletId,
  expenseId,
  expense,
}: {
  walletId: string;
  expenseId: string;
  expense: ExpenseData;
}): Promise<ExpenseUpdateResponse | null> {
  try {
    const response: AxiosResponse<ExpenseUpdateResponse> = await api.patch(
      updateExpenseUrl(walletId, expenseId),
      expense
    );

    return response.data;
  } catch (error: ServerResponseError | any) {
    handleServerError(error);

    return null;
  }
}
