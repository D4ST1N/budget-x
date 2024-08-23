import { handleServerError } from "@/helpers/handleServerError";
import { updateTagUrl } from "@/helpers/serverUrls";
import { api } from "@/plugins/axios";
import { ServerResponseError } from "@/types/ServerResponse";
import { TagData, TagUpdateResponse } from "@/types/Tag";
import { AxiosResponse } from "axios";

export async function updateTagAction({
  tagId,
  walletId,
  tagData,
}: {
  tagId: string;
  walletId: string;
  tagData: TagData;
}): Promise<TagUpdateResponse | null> {
  try {
    const response: AxiosResponse<TagUpdateResponse> = await api.put(
      updateTagUrl(walletId, tagId),
      tagData
    );

    return response.data;
  } catch (error: ServerResponseError | any) {
    handleServerError(error);

    return null;
  }
}
