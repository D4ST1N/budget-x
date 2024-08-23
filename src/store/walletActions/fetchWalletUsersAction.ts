import { handleServerError } from "@/helpers/handleServerError";
import { getWalletUsersUrl } from "@/helpers/serverUrls";
import { api } from "@/plugins/axios";
import { ServerResponseError } from "@/types/ServerResponse";
import { WalletUsersFetchResponse } from "@/types/Wallet";
import { AxiosResponse } from "axios";

export async function fetchWalletUsersAction({
  walletId,
}: {
  walletId: string;
}): Promise<WalletUsersFetchResponse | null> {
  try {
    const response: AxiosResponse<WalletUsersFetchResponse> = await api.get(
      getWalletUsersUrl(walletId)
    );

    return response.data;
  } catch (error: ServerResponseError | any) {
    handleServerError(error);

    return null;
  }
}
