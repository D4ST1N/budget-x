import { handleServerError } from "@/helpers/handleServerError";
import { updateWalletUrl } from "@/helpers/serverUrls";
import { api } from "@/plugins/axios";
import { ServerResponseError } from "@/types/ServerResponse";
import { WalletData } from "@/types/Wallet";

export async function updateWalletAction({
  walletId,
  walletData,
}: {
  walletId: string;
  walletData: WalletData;
}): Promise<boolean> {
  try {
    await api.patch(updateWalletUrl(walletId), walletData);

    return true;
  } catch (error: ServerResponseError | any) {
    handleServerError(error);

    return false;
  }
}
