import { handleServerError } from "@/helpers/handleServerError";
import { deleteExpensesBulkUrl } from "@/helpers/serverUrls";
import { api } from "@/plugins/axios";
import { DeleteExpensesBulkResponse } from "@/types/Expense";
import { ServerResponseError } from "@/types/ServerResponse";

export async function deleteExpensesBulkAction({
  walletId,
  categoryId,
}: {
  walletId: string;
  categoryId: string;
}): Promise<DeleteExpensesBulkResponse | null> {
  try {
    const response = await api.delete(
      deleteExpensesBulkUrl(walletId, categoryId)
    );

    return response.data;
  } catch (error: ServerResponseError | any) {
    handleServerError(error);

    return null;
  }
}
