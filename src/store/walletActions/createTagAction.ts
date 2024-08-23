import { handleServerError } from "@/helpers/handleServerError";
import { addTagUrl } from "@/helpers/serverUrls";
import { api } from "@/plugins/axios";
import { ServerResponseError } from "@/types/ServerResponse";
import { TagCreationResponse, TagData } from "@/types/Tag";
import { AxiosResponse } from "axios";

export async function createTagAction({
  walletId,
  tagData,
}: {
  walletId: string;
  tagData: TagData;
}): Promise<TagCreationResponse | null> {
  try {
    const response: AxiosResponse<TagCreationResponse> = await api.post(
      addTagUrl(walletId),
      tagData
    );

    return response.data;
  } catch (error: ServerResponseError | any) {
    handleServerError(error);

    return null;
  }
}
