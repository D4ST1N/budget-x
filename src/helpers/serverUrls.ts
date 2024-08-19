export const verifyTokenUrl = () => "/verify";

export const getUserAvatarUrl = () => "/avatar";

export const getUsersUrl = (token: string) => `/users?token=${token}`;

export const getWalletsUrl = (userId: string) => {
  return `/wallet/by-user/${userId}`;
};

export const addWalletUrl = () => "/wallet";

export const updateWalletUrl = (walletId: string) => `/wallet/${walletId}`;

export const deleteWalletUrl = (walletId: string) => `/wallet/${walletId}`;

export const getInvitationLinkUrl = (walletId: string) =>
  `/wallet/${walletId}/invite`;

export const getInvitationInfoUrl = (token: string) => `/wallet/join/${token}`;

export const joinWalletUrl = (token: string) => `/wallet/join/${token}`;

export const getWalletUsersUrl = (walletId: string) =>
  `/wallet/${walletId}/users`;

export const updateWalletUserUrl = (walletId: string, userId: string) =>
  `/wallet/${walletId}/users/${userId}`;

export const deleteWalletUserUrl = (walletId: string, userId: string) =>
  `/wallet/${walletId}/users/${userId}`;

export const getWalletCategoriesUrl = (walletId: string) =>
  `/wallet/${walletId}/category`;

export const addWalletCategoryUrl = (walletId: string) =>
  `/wallet/${walletId}/category`;

export const updateWalletCategoryUrl = (walletId: string, categoryId: string) =>
  `/wallet/${walletId}/category/${categoryId}`;

export const deleteWalletCategoryUrl = (walletId: string, categoryId: string) =>
  `/wallet/${walletId}/category/${categoryId}`;

export const getWalletTagsUrl = (walletId: string) => `/wallet/${walletId}/tag`;

export const addWalletTagUrl = (walletId: string) => `/wallet/${walletId}/tag`;

export const updateWalletTagUrl = (walletId: string, tagId: string) =>
  `/wallet/${walletId}/tag/${tagId}`;

export const deleteWalletTagUrl = (walletId: string, tagId: string) =>
  `/wallet/${walletId}/tag/${tagId}`;
