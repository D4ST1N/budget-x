import { handleServerError } from "@/helpers/handleServerError";
import { createInvitationLinkUrl } from "@/helpers/serverUrls";
import { api } from "@/plugins/axios";
import { InvitationOptions } from "@/types/Invitation";
import { ServerResponseError } from "@/types/ServerResponse";
import { WalletShareResponse } from "@/types/Wallet";
import { AxiosResponse } from "axios";

export async function createInvitationLinkAction({
  walletId,
  invitationOptions,
}: {
  walletId: string;
  invitationOptions: InvitationOptions;
}): Promise<string | null> {
  try {
    const response: AxiosResponse<WalletShareResponse> = await api.post(
      createInvitationLinkUrl(walletId),
      invitationOptions
    );

    return response.data.token;
  } catch (error: ServerResponseError | any) {
    handleServerError(error);

    return null;
  }
}
