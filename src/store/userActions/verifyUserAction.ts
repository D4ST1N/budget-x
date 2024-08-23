import { handleServerError } from "@/helpers/handleServerError";
import { verifyTokenUrl } from "@/helpers/serverUrls";
import { auth } from "@/plugins/axios";
import { ServerResponseError } from "@/types/ServerResponse";
import { UserVerificationResponse } from "@/types/User";
import { AxiosResponse } from "axios";

export async function verifyUserAction({
  token,
}: {
  token: string;
}): Promise<UserVerificationResponse | null> {
  try {
    const response: AxiosResponse<UserVerificationResponse> = await auth.post(
      verifyTokenUrl(),
      { token }
    );

    return response.data;
  } catch (error: ServerResponseError | any) {
    handleServerError(error);

    return null;
  }
}
