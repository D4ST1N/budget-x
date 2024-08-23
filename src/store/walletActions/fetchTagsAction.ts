import { handleServerError } from "@/helpers/handleServerError";
import { getTagsUrl } from "@/helpers/serverUrls";
import { api } from "@/plugins/axios";
import { ServerResponseError } from "@/types/ServerResponse";
import { WalletTagsFetchResponse } from "@/types/Tag";
import { AxiosResponse } from "axios";

export async function fetchTagsAction({
  walletId,
}: {
  walletId: string;
}): Promise<WalletTagsFetchResponse | null> {
  try {
    const response: AxiosResponse<WalletTagsFetchResponse> = await api.get(
      getTagsUrl(walletId)
    );

    return response.data;
  } catch (error: ServerResponseError | any) {
    handleServerError(error);

    return null;
  }
}
