import { handleServerError } from "@/helpers/handleServerError";
import { deleteWalletUserUrl } from "@/helpers/serverUrls";
import { api } from "@/plugins/axios";
import { ServerResponseError } from "@/types/ServerResponse";

export async function deleteWalletUserAction({
  walletId,
  userId,
}: {
  walletId: string;
  userId: string;
}): Promise<boolean> {
  try {
    await api.delete(deleteWalletUserUrl(walletId, userId));

    return true;
  } catch (error: ServerResponseError | any) {
    handleServerError(error);

    return false;
  }
}
