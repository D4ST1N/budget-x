import { handleServerError } from "@/helpers/handleServerError";
import { addCategoryUrl } from "@/helpers/serverUrls";
import { api } from "@/plugins/axios";
import { CategoryCreationResponse, CategoryData } from "@/types/Category";
import { ServerResponseError } from "@/types/ServerResponse";
import { AxiosResponse } from "axios";

export async function createCategoryAction({
  walletId,
  categoryData,
}: {
  walletId: string;
  categoryData: CategoryData;
}): Promise<CategoryCreationResponse | null> {
  try {
    const response: AxiosResponse<CategoryCreationResponse> = await api.post(
      addCategoryUrl(walletId),
      {
        ...categoryData,
        walletId,
      }
    );

    return response.data;
  } catch (error: ServerResponseError | any) {
    handleServerError(error);

    return null;
  }
}
