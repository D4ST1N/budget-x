import { SuccessServerResponse } from "@/types/ServerResponse";

import { AccessLevel } from "./AccessLevel";
import { Category } from "./Category";
import { UserData } from "./User";

export interface WalletData {
  name: string;
  creator: string;
  allowedUsers: {
    userId: string;
    accessLevels: AccessLevel[];
  }[];
}

export interface Wallet extends WalletData {
  _id: string;
  __v: number;
}

export interface SuccessWalletFetchResponse extends SuccessServerResponse {
  wallets: Wallet[];
  sharedWallets: Wallet[];
}

export interface SuccessWalletCreationResponse extends SuccessServerResponse {
  walletId: string;
}

export interface SuccessWalletShareResponse extends SuccessServerResponse {
  token: string;
}

export interface SuccessWalletUsersFetchResponse extends SuccessServerResponse {
  users: UserData[];
}

export interface SuccessInvitationInfoResponse extends SuccessServerResponse {
  walletName: string;
  creator: UserData;
}

export interface SuccessWalletCategoriesFetchResponse
  extends SuccessServerResponse {
  categories: Category[];
}
