export type PublicUser = {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  balance: number;
  createdAt: string;
  isAdmin: boolean;
};

