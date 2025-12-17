export interface Database {
  public: {
    Tables: {
      markets: {
        Row: {
          id: string;
          title_rus: string;
          title_eng: string;
          description: string | null;
          pool_yes: number;
          pool_no: number;
          expires_at: string;
          outcome: "YES" | "NO" | null;
        };
        Insert: {
          id?: string;
          title_rus: string;
          title_eng: string;
          description?: string | null;
          pool_yes?: number;
          pool_no?: number;
          expires_at: string;
          outcome?: "YES" | "NO" | null;
        };
        Update: Partial<Database["public"]["Tables"]["markets"]["Insert"]>;
      };
      bets: {
        Row: {
          id: string;
          side: "YES" | "NO";
          amount: number;
          status: string;
          payout: number | null;
          created_at: string;
          user_id: string;
          market_id: string;
        };
        Insert: {
          id?: string;
          side: "YES" | "NO";
          amount: number;
          status?: string;
          payout?: number | null;
          created_at?: string;
          user_id: string;
          market_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["bets"]["Insert"]>;
      };
      users: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          balance: number;
          created_at: string;
          email: string;
          password_hash: string | null;
          is_admin: boolean;
        };
        Insert: {
          id?: string;
          username: string;
          display_name?: string | null;
          balance?: number;
          created_at?: string;
          email: string;
          password_hash?: string | null;
          is_admin?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
    };
  };
}

