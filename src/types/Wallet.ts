import { AccessLevel } from "./AccessLevel";
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

export interface WalletFetchResponse {
  wallets: Wallet[];
  sharedWallets: Wallet[];
}

export interface WalletCreationResponse {
  walletId: string;
}

export interface WalletShareResponse {
  token: string;
}

export interface WalletUsersFetchResponse {
  users: UserData[];
}

export interface InvitationInfoResponse {
  walletName: string;
  creator: UserData;
}
