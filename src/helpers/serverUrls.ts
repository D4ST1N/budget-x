export const getWallets = (userId: string) => {
  return `/wallet/by-user/${userId}`;
};

export const authVerify = () => "/verify";

export const getAvatar = () => "/avatar";

export const fetchUsers = (token: string) => `/users?token=${token}`;

export const addWallet = () => "/wallet";

export const updateWallet = (walletId: string) => `/wallet/${walletId}`;

export const deleteWallet = (walletId: string) => `/wallet/${walletId}`;

export const getInvite = (walletId: string) => `/wallet/${walletId}/invite`;

export const getInvitationInfo = (token: string) => `/wallet/join/${token}`;

export const joinWallet = (token: string) => `/wallet/join/${token}`;

export const getWalletUsers = (walletId: string) => `/wallet/${walletId}/users`;

export const editWalletUser = (walletId: string, userId: string) =>
  `/wallet/${walletId}/users/${userId}`;

export const removeWalletUser = (walletId: string, userId: string) =>
  `/wallet/${walletId}/users/${userId}`;
