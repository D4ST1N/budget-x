import { handleServerError } from "@/helpers/handleServerError";
import { getCategoriesUrl } from "@/helpers/serverUrls";
import { api } from "@/plugins/axios";
import { FetchCategoriesResponse } from "@/types/Category";
import { ServerResponseError } from "@/types/ServerResponse";
import { AxiosResponse } from "axios";

export async function fetchCategoriesAction({
  walletId,
}: {
  walletId: string;
}): Promise<FetchCategoriesResponse | null> {
  try {
    const response: AxiosResponse<FetchCategoriesResponse> = await api.get(
      getCategoriesUrl(walletId)
    );

    return response.data;
  } catch (error: ServerResponseError | any) {
    handleServerError(error);

    return null;
  }
}
