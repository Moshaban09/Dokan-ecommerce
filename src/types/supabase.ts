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
      profiles: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          first_name?: string;
          last_name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          first_name?: string;
          last_name?: string;
          phone?: string | null;
          avatar_url?: string | null;
        };
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          first_name: string;
          company_name: string | null;
          street_address: string;
          apartment: string | null;
          city: string;
          phone: string;
          email: string;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          first_name: string;
          company_name?: string | null;
          street_address: string;
          apartment?: string | null;
          city: string;
          phone: string;
          email: string;
          is_default?: boolean;
          created_at?: string;
        };
        Update: {
          first_name?: string;
          company_name?: string | null;
          street_address?: string;
          apartment?: string | null;
          city?: string;
          phone?: string;
          email?: string;
          is_default?: boolean;
        };
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: number;
          quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: number;
          quantity?: number;
          created_at?: string;
        };
        Update: {
          quantity?: number;
        };
      };
      wishlist_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: number;
          created_at?: string;
        };
        Update: Record<string, never>;
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          address_id: string | null;
          order_number: string;
          status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
          payment_method: "cod" | "bank";
          subtotal: number;
          discount: number;
          total: number;
          coupon_code: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          address_id?: string | null;
          order_number: string;
          status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
          payment_method: "cod" | "bank";
          subtotal: number;
          discount?: number;
          total: number;
          coupon_code?: string | null;
          created_at?: string;
        };
        Update: {
          status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: number;
          title: string;
          price: number;
          quantity: number;
          image: string | null;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: number;
          title: string;
          price: number;
          quantity: number;
          image?: string | null;
        };
        Update: Record<string, never>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}


export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Address = Database["public"]["Tables"]["addresses"]["Row"];
export type CartItem = Database["public"]["Tables"]["cart_items"]["Row"];
export type WishlistItem = Database["public"]["Tables"]["wishlist_items"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type OrderStatus = Order["status"];
export type PaymentMethod = Order["payment_method"];
