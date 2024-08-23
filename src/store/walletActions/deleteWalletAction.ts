import { handleServerError } from "@/helpers/handleServerError";
import { deleteWalletUrl } from "@/helpers/serverUrls";
import { api } from "@/plugins/axios";
import { ServerResponseError } from "@/types/ServerResponse";

export async function deleteWalletAction({
  walletId,
}: {
  walletId: string;
}): Promise<boolean> {
  try {
    await api.delete(deleteWalletUrl(walletId));

    return true;
  } catch (error: ServerResponseError | any) {
    handleServerError(error);

    return false;
  }
}
