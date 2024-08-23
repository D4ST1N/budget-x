import { handleServerError } from "@/helpers/handleServerError";
import { deleteTagUrl } from "@/helpers/serverUrls";
import { api } from "@/plugins/axios";
import { ServerResponseError } from "@/types/ServerResponse";

export async function deleteTagAction({
  walletId,
  tagId,
}: {
  walletId: string;
  tagId: string;
}): Promise<boolean> {
  try {
    await api.delete(deleteTagUrl(walletId, tagId));

    return true;
  } catch (error: ServerResponseError | any) {
    handleServerError(error);

    return false;
  }
}
