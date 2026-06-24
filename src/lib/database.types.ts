export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      stores: {
        Row: {
          id: string;
          name: string;
          prefecture: string;
          prefecture_code: string;
          address: string | null;
          url: string | null;
          latitude: number | null;
          longitude: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          prefecture: string;
          prefecture_code: string;
          address?: string | null;
          url?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          prefecture?: string;
          prefecture_code?: string;
          address?: string | null;
          url?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          created_at?: string;
        };
      };
      stock_updates: {
        Row: {
          id: string;
          store_id: string;
          edition: string;
          quantity_range: string;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          store_id: string;
          edition: string;
          quantity_range: string;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          store_id?: string;
          edition?: string;
          quantity_range?: string;
          note?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      latest_stock: {
        Row: {
          id: string;
          store_id: string;
          edition: string;
          quantity_range: string;
          note: string | null;
          created_at: string;
          store_name: string;
          prefecture: string;
          prefecture_code: string;
        };
      };
    };
  };
}
