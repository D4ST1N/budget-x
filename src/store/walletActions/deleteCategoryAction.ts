import { handleServerError } from "@/helpers/handleServerError";
import { deleteCategoryUrl } from "@/helpers/serverUrls";
import { api } from "@/plugins/axios";
import { ServerResponseError } from "@/types/ServerResponse";
import { AxiosResponse } from "axios";

export async function deleteCategoryAction({
  walletId,
  categoryId,
}: {
  walletId: string;
  categoryId: string;
}): Promise<boolean> {
  try {
    const response: AxiosResponse<{ success: true }> = await api.delete(
      deleteCategoryUrl(walletId, categoryId)
    );

    return response.data.success;
  } catch (error: ServerResponseError | any) {
    handleServerError(error);

    return false;
  }
}
