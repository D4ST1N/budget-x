import { handleServerError } from "@/helpers/handleServerError";
import { updateCategoryUrl } from "@/helpers/serverUrls";
import { api } from "@/plugins/axios";
import { CategoryData, CategoryUpdateResponse } from "@/types/Category";
import { ServerResponseError } from "@/types/ServerResponse";
import { AxiosResponse } from "axios";

export async function updateCategoryAction({
  walletId,
  categoryId,
  categoryData,
}: {
  walletId: string;
  categoryId: string;
  categoryData: CategoryData;
}): Promise<CategoryUpdateResponse | null> {
  try {
    const response: AxiosResponse<CategoryUpdateResponse> = await api.patch(
      updateCategoryUrl(walletId, categoryId),
      categoryData
    );

    return response.data;
  } catch (error: ServerResponseError | any) {
    handleServerError(error);

    return null;
  }
}
