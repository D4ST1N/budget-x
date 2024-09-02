import { handleServerError } from "@/helpers/handleServerError";
import { getWalletsUrl } from "@/helpers/serverUrls";
import { api } from "@/plugins/axios";
import { ServerResponseError } from "@/types/ServerResponse";
import { WalletFetchResponse } from "@/types/Wallet";
import { AxiosResponse } from "axios";

export async function fetchWalletsAction(): Promise<WalletFetchResponse | null> {
  try {
    const response: AxiosResponse<WalletFetchResponse> =
      await api.get(getWalletsUrl());

    return response.data;
  } catch (error: ServerResponseError | any) {
    handleServerError(error);

    return null;
  }
}
