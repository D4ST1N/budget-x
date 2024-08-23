import { handleServerError } from "@/helpers/handleServerError";
import { updateWalletUserUrl } from "@/helpers/serverUrls";
import { api } from "@/plugins/axios";
import { AccessLevel } from "@/types/AccessLevel";
import { ServerResponseError } from "@/types/ServerResponse";

export async function updateWalletUserAction({
  walletId,
  userId,
  accessLevels,
}: {
  walletId: string;
  userId: string;
  accessLevels: AccessLevel[];
}): Promise<boolean> {
  try {
    await api.patch(updateWalletUserUrl(walletId, userId), accessLevels);

    return true;
  } catch (error: ServerResponseError | any) {
    handleServerError(error);

    return false;
  }
}
