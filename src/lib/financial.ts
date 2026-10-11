// 4G TRIP: Precise Integer Financial Calculations & Indonesian Rupiah Formatter
import { Budget, BudgetCategory, Contribution, Expense, FinancialSummary, TripMember } from '../types';

/**
 * Formats an integer amount into standard Indonesian Rupiah format (e.g. Rp15.000.000)
 */
export function formatRupiah(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Rp0';
  }
  // Ensure integer value
  const intAmount = Math.round(amount);
  const isNegative = intAmount < 0;
  const absAmount = Math.abs(intAmount);
  
  const formatted = absAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return isNegative ? `-Rp${formatted}` : `Rp${formatted}`;
}

/**
 * Compact Indonesian Rupiah formatter (e.g. Rp15 Jt, Rp500 Rb)
 */
export function formatRupiahCompact(amount: number): string {
  const absAmount = Math.abs(Math.round(amount));
  if (absAmount >= 1_000_000_000) {
    return `Rp${(absAmount / 1_000_000_000).toFixed(1).replace('.0', '')} M`;
  }
  if (absAmount >= 1_000_000) {
    return `Rp${(absAmount / 1_000_000).toFixed(1).replace('.0', '')} Jt`;
  }
  if (absAmount >= 1_000) {
    return `Rp${(absAmount / 1_000).toFixed(0)} Rb`;
  }
  return formatRupiah(amount);
}

/**
 * Parses user input string (e.g. "Rp 15.000.000" or "15000000") to integer Rupiah
 */
export function parseRupiahInput(value: string): number {
  if (!value) return 0;
  const cleaned = value.replace(/[^0-9]/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
}

/**
 * Calculates global financial summary with exact integer arithmetic
 */
export function calculateFinancialSummary(
  budget: Budget | null,
  categories: BudgetCategory[],
  contributions: Contribution[],
  expenses: Expense[]
): FinancialSummary {
  const target_amount = budget?.target_amount && budget.target_amount > 0 ? Math.round(budget.target_amount) : 0;

  // Verified contributions: only status === 'verified' and amount > 0
  const total_verified_contributions = contributions
    .filter((c) => c.status === 'verified' && c.amount > 0)
    .reduce((sum, c) => sum + Math.round(c.amount), 0);

  // Pending contributions: awaiting admin review
  const total_pending_contributions = contributions
    .filter((c) => c.status === 'pending' && c.amount > 0)
    .reduce((sum, c) => sum + Math.round(c.amount), 0);

  // Recorded expenses: amount > 0
  const total_expenses = expenses
    .filter((e) => e.amount > 0)
    .reduce((sum, e) => sum + Math.round(e.amount), 0);

  // Available balance: SUM(verified contributions) - SUM(recorded expenses)
  const available_balance = total_verified_contributions - total_expenses;

  // Remaining savings target: MAX(target budget - verified contributions, 0)
  const remaining_savings_target = Math.max(target_amount - total_verified_contributions, 0);

  // Savings target progress: SUM(verified contributions) / target budget * 100
  const savings_progress_percentage = target_amount > 0 
    ? Math.min(Math.round((total_verified_contributions / target_amount) * 100), 100)
    : 0;

  // Total allocated budget across categories
  const total_allocated_budget = categories.reduce((sum, cat) => sum + Math.round(cat.allocated_amount), 0);

  // Spending budget consumption: recorded expenses / allocated budget * 100
  const baseBudget = total_allocated_budget > 0 ? total_allocated_budget : target_amount;
  const spending_budget_consumption_percentage = baseBudget > 0
    ? Math.round((total_expenses / baseBudget) * 100)
    : 0;

  return {
    target_amount,
    total_verified_contributions,
    total_pending_contributions,
    total_expenses,
    available_balance,
    remaining_savings_target,
    savings_progress_percentage,
    total_allocated_budget,
    spending_budget_consumption_percentage
  };
}

export interface CategoryFinancialStatus {
  category: BudgetCategory;
  allocated: number;
  spent: number;
  remaining: number;
  percentageUsed: number;
  isOverBudget: boolean;
}

/**
 * Calculates category-by-category allocation vs actual expense consumption
 */
export function calculateCategoryBreakdown(
  categories: BudgetCategory[],
  expenses: Expense[]
): CategoryFinancialStatus[] {
  return categories.map((cat) => {
    const allocated = Math.round(cat.allocated_amount || 0);
    const spent = expenses
      .filter((e) => e.category_id === cat.id && e.amount > 0)
      .reduce((sum, e) => sum + Math.round(e.amount), 0);
    const remaining = allocated - spent;
    const percentageUsed = allocated > 0 ? Math.round((spent / allocated) * 100) : 0;
    const isOverBudget = spent > allocated;

    return {
      category: cat,
      allocated,
      spent,
      remaining,
      percentageUsed,
      isOverBudget
    };
  });
}

export interface MemberFinancialStatus {
  member: TripMember;
  verifiedAmount: number;
  pendingAmount: number;
  targetAmount: number;
  progressPercentage: number;
}

/**
 * Calculates individual member savings contributions and targets
 */
export function calculateMemberFinancials(
  members: TripMember[],
  contributions: Contribution[],
  totalTripTarget: number
): MemberFinancialStatus[] {
  // Fair individual target fallback if not custom set
  const defaultTargetPerMember = members.length > 0 ? Math.round(totalTripTarget / members.length) : 0;

  return members.map((member) => {
    const memberTarget = member.target_contribution > 0 ? member.target_contribution : defaultTargetPerMember;

    const verifiedAmount = contributions
      .filter((c) => c.member_id === member.user_id && c.status === 'verified')
      .reduce((sum, c) => sum + Math.round(c.amount), 0);

    const pendingAmount = contributions
      .filter((c) => c.member_id === member.user_id && c.status === 'pending')
      .reduce((sum, c) => sum + Math.round(c.amount), 0);

    const progressPercentage = memberTarget > 0 
      ? Math.min(Math.round((verifiedAmount / memberTarget) * 100), 100) 
      : 0;

    return {
      member,
      verifiedAmount,
      pendingAmount,
      targetAmount: memberTarget,
      progressPercentage
    };
  });
}
