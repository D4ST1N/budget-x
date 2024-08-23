import { handleServerError } from "@/helpers/handleServerError";
import { deleteExpenseUrl } from "@/helpers/serverUrls";
import { api } from "@/plugins/axios";
import { ServerResponseError } from "@/types/ServerResponse";

export async function deleteExpenseAction({
  walletId,
  expenseId,
}: {
  walletId: string;
  expenseId: string;
}): Promise<boolean> {
  try {
    await api.delete(deleteExpenseUrl(walletId, expenseId));

    return true;
  } catch (error: ServerResponseError | any) {
    handleServerError(error);

    return false;
  }
}
