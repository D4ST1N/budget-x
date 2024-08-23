import { handleServerError } from "@/helpers/handleServerError";
import { addExpenseUrl } from "@/helpers/serverUrls";
import { api } from "@/plugins/axios";
import { ExpenseCreationResponse, ExpenseData } from "@/types/Expense";
import { ServerResponseError } from "@/types/ServerResponse";
import { AxiosResponse } from "axios";

export async function createExpenseAction({
  walletId,
  expenseData,
}: {
  walletId: string;
  expenseData: ExpenseData;
}): Promise<ExpenseCreationResponse | null> {
  try {
    const response: AxiosResponse<ExpenseCreationResponse> = await api.post(
      addExpenseUrl(walletId),
      expenseData
    );

    return response.data;
  } catch (error: ServerResponseError | any) {
    handleServerError(error);

    return null;
  }
}
