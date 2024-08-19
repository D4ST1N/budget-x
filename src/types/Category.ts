import { SuccessServerResponse } from "./ServerResponse";

export interface CategoryData {
  name: string;
  parentCategory: string | null;
}

export interface Category extends CategoryData {
  walletId: string;
  _id: string;
  __v: number;
}

export interface CategoryTreeElement extends Category {
  subCategories: Category[];
}

export interface SuccessWalletCategoriesFetchResponse
  extends SuccessServerResponse {
  categories: Category[];
}
