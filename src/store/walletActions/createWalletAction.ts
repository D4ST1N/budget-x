import { handleServerError } from "@/helpers/handleServerError";
import { addWalletUrl } from "@/helpers/serverUrls";
import { api } from "@/plugins/axios";
import { ServerResponseError } from "@/types/ServerResponse";
import { WalletCreationResponse, WalletData } from "@/types/Wallet";
import { AxiosResponse } from "axios";

export async function createWalletAction({
  walletName,
  userId,
}: {
  walletName: string;
  userId: string;
}): Promise<WalletCreationResponse | null> {
  try {
    const walletData: WalletData = {
      name: walletName,
      creator: userId,
      allowedUsers: [],
    };

    const response: AxiosResponse<WalletCreationResponse> = await api.post(
      addWalletUrl(),
      walletData
    );

    return response.data;
  } catch (error: ServerResponseError | any) {
    handleServerError(error);

    return null;
  }
}
