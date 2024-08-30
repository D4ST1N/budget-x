import { handleServerError } from "@/helpers/handleServerError";
import { transferExpensesUrl } from "@/helpers/serverUrls";
import { api } from "@/plugins/axios";
import { TransferExpensesResponse } from "@/types/Expense";
import { ServerResponseError } from "@/types/ServerResponse";
import { AxiosResponse } from "axios";

export async function transferExpensesAction({
  walletId,
  fromCategoryId,
  toCategoryId,
  categoryName,
  parentCategory,
}: {
  walletId: string;
  fromCategoryId: string;
  toCategoryId?: string;
  categoryName?: string;
  parentCategory?: string | null;
}): Promise<TransferExpensesResponse | null> {
  try {
    const response: AxiosResponse<TransferExpensesResponse> = await api.post(
      transferExpensesUrl(walletId),
      { fromCategoryId, toCategoryId, categoryName, parentCategory }
    );

    return response.data;
  } catch (error: ServerResponseError | any) {
    handleServerError(error);

    return null;
  }
}
