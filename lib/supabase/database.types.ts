export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      groups: {
        Row: {
          id: string
          name: string
          description: string | null
          contribution_amount: string
          payout_cycle: number
          treasury_balance: string
          created_at: string
        }
        Insert: {
          id: string
          name: string
          description?: string | null
          contribution_amount: string
          payout_cycle: number
          treasury_balance?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          contribution_amount?: string
          payout_cycle?: number
          treasury_balance?: string
          created_at?: string
        }
      }
      members: {
        Row: {
          id: string
          group_id: string
          address: string
          name: string | null
          status: string
          joined_at: string
          last_contribution: string | null
        }
        Insert: {
          id?: string
          group_id: string
          address: string
          name?: string | null
          status?: string
          joined_at?: string
          last_contribution?: string | null
        }
        Update: {
          id?: string
          group_id?: string
          address?: string
          name?: string | null
          status?: string
          joined_at?: string
          last_contribution?: string | null
        }
      }
      contributions: {
        Row: {
          id: string
          group_id: string
          member_address: string
          amount: string
          round: number
          tx_hash: string
          created_at: string
          status: string
        }
        Insert: {
          id?: string
          group_id: string
          member_address: string
          amount: string
          round?: number
          tx_hash: string
          created_at?: string
          status?: string
        }
        Update: {
          id?: string
          group_id?: string
          member_address?: string
          amount?: string
          round?: number
          tx_hash?: string
          created_at?: string
          status?: string
        }
      }
      payouts: {
        Row: {
          id: string
          group_id: string
          recipient_address: string
          amount: string
          round: number
          tx_hash: string
          created_at: string
          status: string
        }
        Insert: {
          id?: string
          group_id: string
          recipient_address: string
          amount: string
          round: number
          tx_hash: string
          created_at?: string
          status?: string
        }
        Update: {
          id?: string
          group_id?: string
          recipient_address?: string
          amount?: string
          round?: number
          tx_hash?: string
          created_at?: string
          status?: string
        }
      }
    }
  }
}
