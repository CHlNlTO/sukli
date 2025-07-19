// src/types/database.ts
export interface UserProfile {
  id: string;
  clerk_user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  default_currency: string;
  custom_gemini_api_key?: string;
  theme_preference: "clarity" | "focus";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  custom_theme_config: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  transaction_type: TransactionType;
  merchant_name?: string;
  category?: string;
  transaction_date: string;
  description?: string;
  notes?: string;
  image_url?: string;
  image_public_id?: string;
  is_ai_parsed: boolean;
  confidence_score?: number;
  created_at: string;
  updated_at: string;
}

export interface UserPrompt {
  id: string;
  user_id: string;
  name: string;
  prompt_content: string;
  is_active: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface ParsedReceiptData {
  amount: number;
  currency: string;
  transaction_type?: TransactionType;
  merchant_name?: string;
  category?: string;
  transaction_date: string;
  description?: string;
  confidence_score: number;
}

export interface UploadedImage {
  id: string;
  file: File;
  preview_url: string;
  parsed_data?: ParsedReceiptData;
  status: "uploading" | "parsing" | "completed" | "error";
  error_message?: string;
  image_url?: string;
}

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, "id" | "created_at" | "updated_at">;
        Update: Partial<
          Omit<UserProfile, "id" | "clerk_user_id" | "created_at">
        >;
      };
      user_prompts: {
        Row: UserPrompt;
        Insert: Omit<UserPrompt, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<UserPrompt, "id" | "user_id" | "created_at">>;
      };
      transactions: {
        Row: Transaction;
        Insert: Omit<Transaction, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Transaction, "id" | "user_id" | "created_at">>;
      };
    };
  };
}
