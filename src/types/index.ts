// 4G TRIP: Core Application Data Types

export type UserRole = 'owner' | 'admin' | 'member';

export interface UserProfile {
  id: string;
  display_name: string;
  avatar_url?: string;
  phone?: string;
  email?: string;
  created_at?: string;
}

export type TripStatus = 'draft' | 'planning' | 'confirmed' | 'ongoing' | 'completed';

export interface Trip {
  id: string;
  name: string;
  origin: string;
  destination: string;
  departure_date: string | null;
  return_date: string | null;
  status: TripStatus;
  cover_image_url?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface TripMember {
  id: string;
  trip_id: string;
  user_id: string;
  role: UserRole;
  target_contribution: number; // Integer Rupiah
  joined_at: string;
  profile?: UserProfile;
}

export interface Budget {
  id: string;
  trip_id: string;
  target_amount: number; // Integer Rupiah (e.g. 15000000)
  currency: string;
  revision_note?: string;
  created_by: string;
  updated_at: string;
}

export type BudgetCategoryType = 
  | 'flights' 
  | 'accommodation' 
  | 'food' 
  | 'transport' 
  | 'attractions' 
  | 'internet_sim' 
  | 'emergency' 
  | 'custom';

export interface BudgetCategory {
  id: string;
  trip_id: string;
  name: string;
  allocated_amount: number; // Integer Rupiah
  category_type: BudgetCategoryType;
  icon_name?: string;
  created_at: string;
}

export type ContributionStatus = 'pending' | 'verified' | 'rejected';
export type PaymentMethod = 
  | 'bank_transfer' 
  | 'qris' 
  | 'gopay' 
  | 'ovo' 
  | 'dana' 
  | 'cash' 
  | 'other';

export interface Contribution {
  id: string;
  trip_id: string;
  member_id: string;
  amount: number; // Integer Rupiah
  payment_method: PaymentMethod;
  payment_date: string;
  reference_number?: string;
  receipt_url?: string;
  notes?: string;
  status: ContributionStatus;
  verified_by?: string;
  verified_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at?: string;
  member_profile?: UserProfile;
  verified_profile?: UserProfile;
}

export interface Expense {
  id: string;
  trip_id: string;
  category_id?: string;
  amount: number; // Integer Rupiah
  description: string;
  expense_date: string;
  receipt_url?: string;
  responsible_member_id?: string;
  created_by: string;
  created_at: string;
  updated_at?: string;
  category?: BudgetCategory;
  responsible_profile?: UserProfile;
}

export type ItineraryStatus = 'suggested' | 'confirmed' | 'completed' | 'skipped';

export interface ItineraryItem {
  id: string;
  trip_id: string;
  day_number: number;
  title: string;
  description?: string;
  location?: string;
  scheduled_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  estimated_cost: number; // Integer Rupiah
  status: ItineraryStatus;
  sort_order: number;
  assigned_to?: string;
  created_by: string;
  created_at: string;
  assigned_profile?: UserProfile;
}

export type DestinationCategory = 
  | 'culture' 
  | 'nature' 
  | 'food' 
  | 'shopping' 
  | 'entertainment' 
  | 'photography';

export interface Destination {
  id: string;
  trip_id: string;
  name: string;
  description: string;
  image_url: string;
  location: string;
  category: DestinationCategory;
  estimated_cost: number; // Integer Rupiah
  is_saved: boolean;
  notes?: string;
  created_at: string;
}

export type PackingCategory = 
  | 'documents' 
  | 'clothing' 
  | 'gear' 
  | 'health' 
  | 'finance' 
  | 'other';

export interface PackingItem {
  id: string;
  trip_id: string;
  title: string;
  category: PackingCategory;
  is_completed: boolean;
  assigned_to?: string;
  created_by: string;
  created_at: string;
  assigned_profile?: UserProfile;
}

export interface GroupNote {
  id: string;
  trip_id: string;
  author_id: string;
  content: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  author_profile?: UserProfile;
}

export interface ActivityLog {
  id: string;
  trip_id: string;
  actor_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
  actor_profile?: UserProfile;
}

export interface TripInvitation {
  id: string;
  trip_id: string;
  invited_email: string;
  token_hash: string;
  role: UserRole;
  expires_at: string;
  accepted_at?: string;
  created_by: string;
  created_at: string;
}

export interface FinancialSummary {
  target_amount: number;
  total_verified_contributions: number;
  total_pending_contributions: number;
  total_expenses: number;
  available_balance: number;
  remaining_savings_target: number;
  savings_progress_percentage: number;
  total_allocated_budget: number;
  spending_budget_consumption_percentage: number;
}
