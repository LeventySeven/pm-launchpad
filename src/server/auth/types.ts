export type PublicUser = {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  telegramPhotoUrl: string | null;
  referralCode: string | null;
  referralCommissionRate: number | null;
  referralEnabled: boolean | null;
  balance: number;
  createdAt: string;
  isAdmin: boolean;
  solanaWalletAddress: string | null;
  solanaCluster: string | null;
  solanaWalletConnectedAt: string | null;
};

