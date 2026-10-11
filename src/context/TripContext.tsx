import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Trip, TripMember, Budget, BudgetCategory, Contribution, Expense, 
  ItineraryItem, Destination, PackingItem, GroupNote, ActivityLog, 
  FinancialSummary, UserProfile, UserRole, PaymentMethod, ContributionStatus, ItineraryStatus 
} from '../types';
import { getSavedState, saveState, AppState, DEFAULT_PROFILES } from '../lib/storage';
import { calculateFinancialSummary, calculateCategoryBreakdown, calculateMemberFinancials, CategoryFinancialStatus, MemberFinancialStatus } from '../lib/financial';
import { useAuth } from './AuthContext';

interface TripContextType {
  trip: Trip;
  otherTrips: Trip[];
  members: TripMember[];
  budget: Budget;
  budgetHistory: Array<{ date: string; amount: number; note: string; updatedBy: string }>;
  categories: BudgetCategory[];
  contributions: Contribution[];
  expenses: Expense[];
  itinerary: ItineraryItem[];
  destinations: Destination[];
  packing: PackingItem[];
  notes: GroupNote[];
  activityLogs: ActivityLog[];
  financialSummary: FinancialSummary;
  categoryBreakdown: CategoryFinancialStatus[];
  memberFinancials: MemberFinancialStatus[];
  
  // Actions
  updateTripDetails: (updates: Partial<Trip>) => void;
  updateBudgetTarget: (newAmount: number, note: string) => void;
  addBudgetCategory: (name: string, allocatedAmount: number, categoryType: any, iconName?: string) => void;
  updateBudgetCategory: (id: string, name: string, allocatedAmount: number) => void;
  deleteBudgetCategory: (id: string) => void;
  
  submitContribution: (
    amount: number,
    paymentMethod: PaymentMethod,
    paymentDate: string,
    refNumber?: string,
    notes?: string,
    receiptUrl?: string
  ) => void;
  verifyContribution: (id: string, status: 'verified' | 'rejected', reason?: string) => void;
  
  recordExpense: (
    categoryId: string,
    amount: number,
    description: string,
    date: string,
    responsibleMemberId?: string,
    receiptUrl?: string
  ) => void;
  deleteExpense: (id: string) => void;
  
  addItineraryItem: (
    dayNumber: number,
    title: string,
    description: string,
    location: string,
    startTime: string,
    endTime: string,
    estimatedCost: number,
    assignedTo?: string
  ) => void;
  updateItineraryItem: (id: string, updates: Partial<ItineraryItem>) => void;
  deleteItineraryItem: (id: string) => void;
  
  togglePackingItem: (id: string) => void;
  addPackingItem: (title: string, category: any, assignedTo?: string) => void;
  deletePackingItem: (id: string) => void;
  
  toggleSaveDestination: (id: string) => void;
  addDestinationToItinerary: (destinationId: string, dayNumber: number) => void;
  addCustomDestination: (name: string, desc: string, location: string, category: any, cost: number, image?: string) => void;
  
  addGroupNote: (content: string) => void;
  deleteGroupNote: (id: string) => void;
  
  inviteMember: (email: string, role: UserRole) => { inviteLink: string };
  updateMemberRole: (userId: string, newRole: UserRole) => void;
  removeMember: (userId: string) => void;
  resetAllData: () => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, currentRole } = useAuth();
  const [state, setState] = useState<AppState>(() => getSavedState());

  // Save to localStorage on state changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Derived financial computations
  const financialSummary = useMemo(() => {
    return calculateFinancialSummary(
      state.budget,
      state.categories,
      state.contributions,
      state.expenses
    );
  }, [state.budget, state.categories, state.contributions, state.expenses]);

  const categoryBreakdown = useMemo(() => {
    return calculateCategoryBreakdown(state.categories, state.expenses);
  }, [state.categories, state.expenses]);

  const memberFinancials = useMemo(() => {
    return calculateMemberFinancials(
      state.members,
      state.contributions,
      state.budget.target_amount
    );
  }, [state.members, state.contributions, state.budget.target_amount]);

  // Activity logger helper
  const logActivity = (action: string, entityType: string, entityId?: string, metadata?: any) => {
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      trip_id: state.trip.id,
      actor_id: currentUser.id,
      action,
      entity_type: entityType,
      entity_id: entityId,
      metadata,
      created_at: new Date().toISOString(),
      actor_profile: currentUser
    };
    return [newLog, ...state.activityLogs];
  };

  // 1. Update Trip Details
  const updateTripDetails = (updates: Partial<Trip>) => {
    setState((prev) => {
      const updatedTrip = { ...prev.trip, ...updates, updated_at: new Date().toISOString() };
      const logs = [
        {
          id: `act-${Date.now()}`,
          trip_id: prev.trip.id,
          actor_id: currentUser.id,
          action: `Updated trip settings`,
          entity_type: 'trip',
          created_at: new Date().toISOString(),
          actor_profile: currentUser
        },
        ...prev.activityLogs
      ];
      return { ...prev, trip: updatedTrip, activityLogs: logs };
    });
  };

  // 2. Budget Target
  const updateBudgetTarget = (newAmount: number, note: string) => {
    setState((prev) => {
      const updatedBudget: Budget = {
        ...prev.budget,
        target_amount: Math.round(newAmount),
        revision_note: note,
        updated_at: new Date().toISOString()
      };
      const historyItem = {
        date: new Date().toISOString(),
        amount: Math.round(newAmount),
        note: note || 'Target budget adjusted',
        updatedBy: currentUser.display_name
      };
      const logs = [
        {
          id: `act-${Date.now()}`,
          trip_id: prev.trip.id,
          actor_id: currentUser.id,
          action: `Updated savings budget target to Rp${Math.round(newAmount).toLocaleString('id-ID')}`,
          entity_type: 'budget',
          created_at: new Date().toISOString(),
          actor_profile: currentUser
        },
        ...prev.activityLogs
      ];
      return {
        ...prev,
        budget: updatedBudget,
        budgetHistory: [historyItem, ...prev.budgetHistory],
        activityLogs: logs
      };
    });
  };

  // 3. Budget Categories
  const addBudgetCategory = (name: string, allocatedAmount: number, categoryType: any, iconName: string = 'Tag') => {
    const newCat: BudgetCategory = {
      id: `cat-${Date.now()}`,
      trip_id: state.trip.id,
      name,
      allocated_amount: Math.round(allocatedAmount),
      category_type: categoryType,
      icon_name: iconName,
      created_at: new Date().toISOString()
    };
    setState((prev) => ({
      ...prev,
      categories: [...prev.categories, newCat],
      activityLogs: [
        {
          id: `act-${Date.now()}`,
          trip_id: prev.trip.id,
          actor_id: currentUser.id,
          action: `Added budget category "${name}" with Rp${Math.round(allocatedAmount).toLocaleString('id-ID')}`,
          entity_type: 'budget_category',
          created_at: new Date().toISOString(),
          actor_profile: currentUser
        },
        ...prev.activityLogs
      ]
    }));
  };

  const updateBudgetCategory = (id: string, name: string, allocatedAmount: number) => {
    setState((prev) => ({
      ...prev,
      categories: prev.categories.map((c) => (c.id === id ? { ...c, name, allocated_amount: Math.round(allocatedAmount) } : c))
    }));
  };

  const deleteBudgetCategory = (id: string) => {
    setState((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== id)
    }));
  };

  // 4. Contributions
  const submitContribution = (
    amount: number,
    paymentMethod: PaymentMethod,
    paymentDate: string,
    refNumber?: string,
    notes?: string,
    receiptUrl?: string
  ) => {
    const newContribution: Contribution = {
      id: `cb-${Date.now()}`,
      trip_id: state.trip.id,
      member_id: currentUser.id,
      amount: Math.round(amount),
      payment_method: paymentMethod,
      payment_date: paymentDate || new Date().toISOString().split('T')[0],
      reference_number: refNumber,
      notes,
      receipt_url: receiptUrl,
      status: 'pending', // Starts as pending awaiting owner/admin verification
      created_at: new Date().toISOString(),
      member_profile: currentUser
    };

    setState((prev) => ({
      ...prev,
      contributions: [newContribution, ...prev.contributions],
      activityLogs: [
        {
          id: `act-${Date.now()}`,
          trip_id: prev.trip.id,
          actor_id: currentUser.id,
          action: `Submitted contribution of Rp${Math.round(amount).toLocaleString('id-ID')} (${paymentMethod})`,
          entity_type: 'contribution',
          created_at: new Date().toISOString(),
          actor_profile: currentUser
        },
        ...prev.activityLogs
      ]
    }));
  };

  const verifyContribution = (id: string, status: 'verified' | 'rejected', reason?: string) => {
    setState((prev) => {
      const target = prev.contributions.find((c) => c.id === id);
      if (!target) return prev;

      const updatedContributions = prev.contributions.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: status as ContributionStatus,
            verified_by: currentUser.id,
            verified_at: new Date().toISOString(),
            rejection_reason: reason,
            verified_profile: currentUser
          };
        }
        return c;
      });

      const memberName = target.member_profile?.display_name || 'Member';
      const logText = status === 'verified'
        ? `Verified contribution of Rp${target.amount.toLocaleString('id-ID')} from ${memberName}`
        : `Rejected contribution of Rp${target.amount.toLocaleString('id-ID')} from ${memberName}`;

      return {
        ...prev,
        contributions: updatedContributions,
        activityLogs: [
          {
            id: `act-${Date.now()}`,
            trip_id: prev.trip.id,
            actor_id: currentUser.id,
            action: logText,
            entity_type: 'contribution',
            created_at: new Date().toISOString(),
            actor_profile: currentUser
          },
          ...prev.activityLogs
        ]
      };
    });
  };

  // 5. Expenses
  const recordExpense = (
    categoryId: string,
    amount: number,
    description: string,
    date: string,
    responsibleMemberId?: string,
    receiptUrl?: string
  ) => {
    const category = state.categories.find((c) => c.id === categoryId);
    const respMember = state.members.find((m) => m.user_id === responsibleMemberId);

    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      trip_id: state.trip.id,
      category_id: categoryId,
      amount: Math.round(amount),
      description,
      expense_date: date || new Date().toISOString().split('T')[0],
      responsible_member_id: responsibleMemberId,
      created_by: currentUser.id,
      created_at: new Date().toISOString(),
      receipt_url: receiptUrl,
      category,
      responsible_profile: respMember?.profile || currentUser
    };

    setState((prev) => ({
      ...prev,
      expenses: [newExpense, ...prev.expenses],
      activityLogs: [
        {
          id: `act-${Date.now()}`,
          trip_id: prev.trip.id,
          actor_id: currentUser.id,
          action: `Recorded expense Rp${Math.round(amount).toLocaleString('id-ID')} for "${description}"`,
          entity_type: 'expense',
          created_at: new Date().toISOString(),
          actor_profile: currentUser
        },
        ...prev.activityLogs
      ]
    }));
  };

  const deleteExpense = (id: string) => {
    setState((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== id)
    }));
  };

  // 6. Itinerary Items
  const addItineraryItem = (
    dayNumber: number,
    title: string,
    description: string,
    location: string,
    startTime: string,
    endTime: string,
    estimatedCost: number,
    assignedTo?: string
  ) => {
    const assignee = state.members.find((m) => m.user_id === assignedTo);
    const newItem: ItineraryItem = {
      id: `itin-${Date.now()}`,
      trip_id: state.trip.id,
      day_number: dayNumber,
      title,
      description,
      location,
      start_time: startTime || null,
      end_time: endTime || null,
      estimated_cost: Math.round(estimatedCost || 0),
      status: 'suggested',
      sort_order: state.itinerary.filter((i) => i.day_number === dayNumber).length + 1,
      assigned_to: assignedTo,
      created_by: currentUser.id,
      created_at: new Date().toISOString(),
      assigned_profile: assignee?.profile || currentUser
    };

    setState((prev) => ({
      ...prev,
      itinerary: [...prev.itinerary, newItem],
      activityLogs: [
        {
          id: `act-${Date.now()}`,
          trip_id: prev.trip.id,
          actor_id: currentUser.id,
          action: `Added Day ${dayNumber} activity: "${title}"`,
          entity_type: 'itinerary',
          created_at: new Date().toISOString(),
          actor_profile: currentUser
        },
        ...prev.activityLogs
      ]
    }));
  };

  const updateItineraryItem = (id: string, updates: Partial<ItineraryItem>) => {
    setState((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((item) => (item.id === id ? { ...item, ...updates } : item))
    }));
  };

  const deleteItineraryItem = (id: string) => {
    setState((prev) => ({
      ...prev,
      itinerary: prev.itinerary.filter((i) => i.id !== id)
    }));
  };

  // 7. Packing Checklist
  const togglePackingItem = (id: string) => {
    setState((prev) => ({
      ...prev,
      packing: prev.packing.map((p) => (p.id === id ? { ...p, is_completed: !p.is_completed } : p))
    }));
  };

  const addPackingItem = (title: string, category: any, assignedTo?: string) => {
    const assignee = state.members.find((m) => m.user_id === assignedTo);
    const newItem: PackingItem = {
      id: `pack-${Date.now()}`,
      trip_id: state.trip.id,
      title,
      category,
      is_completed: false,
      assigned_to: assignedTo,
      created_by: currentUser.id,
      created_at: new Date().toISOString(),
      assigned_profile: assignee?.profile
    };
    setState((prev) => ({
      ...prev,
      packing: [...prev.packing, newItem]
    }));
  };

  const deletePackingItem = (id: string) => {
    setState((prev) => ({
      ...prev,
      packing: prev.packing.filter((p) => p.id !== id)
    }));
  };

  // 8. Destinations
  const toggleSaveDestination = (id: string) => {
    setState((prev) => ({
      ...prev,
      destinations: prev.destinations.map((d) => (d.id === id ? { ...d, is_saved: !d.is_saved } : d))
    }));
  };

  const addDestinationToItinerary = (destinationId: string, dayNumber: number) => {
    const dest = state.destinations.find((d) => d.id === destinationId);
    if (!dest) return;
    addItineraryItem(
      dayNumber,
      `Explore ${dest.name}`,
      dest.description,
      dest.location,
      '14:00',
      '16:30',
      dest.estimated_cost,
      currentUser.id
    );
  };

  const addCustomDestination = (
    name: string,
    desc: string,
    location: string,
    category: any,
    cost: number,
    image?: string
  ) => {
    const newDest: Destination = {
      id: `dest-${Date.now()}`,
      trip_id: state.trip.id,
      name,
      description: desc,
      location,
      category,
      estimated_cost: Math.round(cost || 0),
      is_saved: true,
      image_url: image || 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800',
      created_at: new Date().toISOString()
    };
    setState((prev) => ({
      ...prev,
      destinations: [newDest, ...prev.destinations]
    }));
  };

  // 9. Notes
  const addGroupNote = (content: string) => {
    const newNote: GroupNote = {
      id: `note-${Date.now()}`,
      trip_id: state.trip.id,
      author_id: currentUser.id,
      content,
      is_pinned: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author_profile: currentUser
    };
    setState((prev) => ({
      ...prev,
      notes: [newNote, ...prev.notes]
    }));
  };

  const deleteGroupNote = (id: string) => {
    setState((prev) => ({
      ...prev,
      notes: prev.notes.filter((n) => n.id !== id)
    }));
  };

  // 10. Members & Invitations
  const inviteMember = (email: string, role: UserRole) => {
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const inviteLink = `${window.location.origin}/invite?token=${token}&trip=${state.trip.id}`;

    // Auto add placeholder member if invited
    const newUserId = `user-${Date.now()}`;
    const newProfile: UserProfile = {
      id: newUserId,
      display_name: email.split('@')[0],
      email,
      avatar_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`,
      phone: '+628120000000'
    };
    DEFAULT_PROFILES[newUserId] = newProfile;

    const newMember: TripMember = {
      id: `mem-${Date.now()}`,
      trip_id: state.trip.id,
      user_id: newUserId,
      role,
      target_contribution: Math.round(state.budget.target_amount / (state.members.length + 1)),
      joined_at: new Date().toISOString(),
      profile: newProfile
    };

    setState((prev) => ({
      ...prev,
      members: [...prev.members, newMember],
      activityLogs: [
        {
          id: `act-${Date.now()}`,
          trip_id: prev.trip.id,
          actor_id: currentUser.id,
          action: `Invited new member ${email} as ${role}`,
          entity_type: 'member',
          created_at: new Date().toISOString(),
          actor_profile: currentUser
        },
        ...prev.activityLogs
      ]
    }));

    return { inviteLink };
  };

  const updateMemberRole = (userId: string, newRole: UserRole) => {
    setState((prev) => ({
      ...prev,
      members: prev.members.map((m) => (m.user_id === userId ? { ...m, role: newRole } : m))
    }));
  };

  const removeMember = (userId: string) => {
    setState((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.user_id !== userId)
    }));
  };

  const resetAllData = () => {
    localStorage.removeItem('4g_trip_workspace_v1_data');
    setState(getSavedState());
  };

  return (
    <TripContext.Provider
      value={{
        ...state,
        financialSummary,
        categoryBreakdown,
        memberFinancials,
        updateTripDetails,
        updateBudgetTarget,
        addBudgetCategory,
        updateBudgetCategory,
        deleteBudgetCategory,
        submitContribution,
        verifyContribution,
        recordExpense,
        deleteExpense,
        addItineraryItem,
        updateItineraryItem,
        deleteItineraryItem,
        togglePackingItem,
        addPackingItem,
        deletePackingItem,
        toggleSaveDestination,
        addDestinationToItinerary,
        addCustomDestination,
        addGroupNote,
        deleteGroupNote,
        inviteMember,
        updateMemberRole,
        removeMember,
        resetAllData
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
