export interface TagData {
  name: string;
}

export interface Tag extends TagData {
  walletId: string;
  _id: string;
  __v: number;
}

export interface WalletTagsFetchResponse {
  tags: Tag[];
}

export interface TagCreationResponse {
  tag: Tag;
}

export interface TagUpdateResponse extends TagCreationResponse {}

export interface TagsCreationResponse {
  tags: Tag[];
}
