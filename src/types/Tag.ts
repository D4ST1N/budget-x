import { SuccessServerResponse } from "./ServerResponse";

export interface TagData {
  name: string;
}

export interface Tag extends TagData {
  walletId: string;
  _id: string;
  __v: number;
}

export interface SuccessWalletTagsFetchResponse extends SuccessServerResponse {
  tags: Tag[];
}
