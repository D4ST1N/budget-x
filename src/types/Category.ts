export interface CategoryData {
  name: string;
  parentCategory: string | null;
  isIncomeCategory: boolean;
}

export interface Category extends CategoryData {
  walletId: string;
  _id: string;
  __v: number;
}

export interface CategoryTreeElement extends Category {
  subCategories: Category[];
}

export interface CategoryCreationResponse {
  category: Category;
}

export interface CategoryUpdateResponse extends CategoryCreationResponse {}

export interface FetchCategoriesResponse {
  categories: Category[];
}
