import { handleServerError } from "@/helpers/handleServerError";
import { getUserDataUrl } from "@/helpers/serverUrls";
import { auth } from "@/plugins/axios";
import { ServerResponseError } from "@/types/ServerResponse";
import { UserVerificationResponse } from "@/types/User";
import { AxiosResponse } from "axios";

export async function fetchUserDataAction(): Promise<UserVerificationResponse | null> {
  try {
    const response: AxiosResponse<UserVerificationResponse> =
      await auth.get(getUserDataUrl());

    return response.data;
  } catch (error: ServerResponseError | any) {
    handleServerError(error);

    return null;
  }
}
