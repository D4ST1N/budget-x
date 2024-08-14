import { SuccessServerResponse } from "@/types/ServerResponse";
import { User } from "@stytch/vanilla-js";

export interface WalletData {
  name: string;
  creator: string;
  allowedUsers: string[];
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
  users: User[];
}
