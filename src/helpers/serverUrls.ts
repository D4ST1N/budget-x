export const verifyTokenUrl = () => "/verify";

export const getUserAvatarUrl = () => "/avatar";

export const getUsersUrl = (token: string) => `/users?token=${token}`;

export const getWalletsUrl = (userId: string) => {
  return `/wallet/by-user/${userId}`;
};

export const addWalletUrl = () => "/wallet";

export const updateWalletUrl = (walletId: string) => `/wallet/${walletId}`;

export const deleteWalletUrl = (walletId: string) => `/wallet/${walletId}`;

export const createInvitationLinkUrl = (walletId: string) =>
  `/wallet/${walletId}/invite`;

export const getInvitationInfoUrl = (token: string) => `/wallet/join/${token}`;

export const joinWalletUrl = (token: string) => `/wallet/join/${token}`;

export const getWalletUsersUrl = (walletId: string) =>
  `/wallet/${walletId}/users`;

export const updateWalletUserUrl = (walletId: string, userId: string) =>
  `/wallet/${walletId}/users/${userId}`;

export const deleteWalletUserUrl = (walletId: string, userId: string) =>
  `/wallet/${walletId}/users/${userId}`;

export const getCategoriesUrl = (walletId: string) =>
  `/wallet/${walletId}/category`;

export const addCategoryUrl = (walletId: string) =>
  `/wallet/${walletId}/category`;

export const updateCategoryUrl = (walletId: string, categoryId: string) =>
  `/wallet/${walletId}/category/${categoryId}`;

export const deleteCategoryUrl = (walletId: string, categoryId: string) =>
  `/wallet/${walletId}/category/${categoryId}`;

export const getTagsUrl = (walletId: string) => `/wallet/${walletId}/tag`;

export const addTagUrl = (walletId: string) => `/wallet/${walletId}/tag`;

export const addTagsBulkUrl = (walletId: string) =>
  `/wallet/${walletId}/tag/bulk`;

export const updateTagUrl = (walletId: string, tagId: string) =>
  `/wallet/${walletId}/tag/${tagId}`;

export const deleteTagUrl = (walletId: string, tagId: string) =>
  `/wallet/${walletId}/tag/${tagId}`;

export const getExpensesUrl = (walletId: string) =>
  `/wallet/${walletId}/expense`;

export const addExpenseUrl = (walletId: string) =>
  `/wallet/${walletId}/expense`;

export const updateExpenseUrl = (walletId: string, expenseId: string) =>
  `/wallet/${walletId}/expense/${expenseId}`;

export const deleteExpenseUrl = (walletId: string, expenseId: string) =>
  `/wallet/${walletId}/expense/${expenseId}`;
