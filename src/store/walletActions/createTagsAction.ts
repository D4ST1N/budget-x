import { handleServerError } from "@/helpers/handleServerError";
import { addTagsBulkUrl } from "@/helpers/serverUrls";
import { api } from "@/plugins/axios";
import { ServerResponseError } from "@/types/ServerResponse";
import { TagData, TagsCreationResponse } from "@/types/Tag";
import { AxiosResponse } from "axios";

export async function createTagsAction({
  walletId,
  tags,
}: {
  walletId: string;
  tags: TagData[];
}): Promise<TagsCreationResponse | null> {
  try {
    const response: AxiosResponse<TagsCreationResponse> = await api.post(
      addTagsBulkUrl(walletId),
      { tags }
    );

    return response.data;
  } catch (error: ServerResponseError | any) {
    handleServerError(error);

    return null;
  }
}
