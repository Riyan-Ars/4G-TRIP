import React, { useState } from 'react';
import { Plus, PiggyBank, Calendar, Compass, ShieldCheck } from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { FeaturedTripHero } from '../components/dashboard/FeaturedTripHero';
import { SavingsFinancialCard } from '../components/dashboard/SavingsFinancialCard';
import { RecentActivityCard } from '../components/dashboard/RecentActivityCard';
import { SchedulePreviewCard } from '../components/dashboard/SchedulePreviewCard';
import { WeatherCard } from '../components/dashboard/WeatherCard';
import { AccommodationCard } from '../components/dashboard/AccommodationCard';
import { DestinationStackCard } from '../components/dashboard/DestinationStackCard';
import { MemberStackCard } from '../components/dashboard/MemberStackCard';
import { PackingMiniCard } from '../components/dashboard/PackingMiniCard';
import { AiPromptBar } from '../components/dashboard/AiPromptBar';
import { PlanTabs } from '../components/dashboard/PlanTabs';
import { AddContributionModal } from '../components/modals/AddContributionModal';
import { EditBudgetModal } from '../components/modals/EditBudgetModal';
import { EditTripModal } from '../components/modals/EditTripModal';
import { AddItineraryModal } from '../components/modals/AddItineraryModal';
import { AddPackingItemModal } from '../components/modals/AddPackingItemModal';
import { AddNoteModal } from '../components/modals/AddNoteModal';
import { InviteMemberModal } from '../components/modals/InviteMemberModal';

export const DashboardPage: React.FC = () => {
  const { trip, financialSummary, members, itinerary } = useTrip();

  const [isContributionOpen, setIsContributionOpen] = useState(false);
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState(false);
  const [isEditTripOpen, setIsEditTripOpen] = useState(false);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [isAddPackingOpen, setIsAddPackingOpen] = useState(false);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 animate-fade-in">
      {/* SECTION A: Compact Application Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/70">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight">
              {trip.name}
            </h1>
            <span className="pill-badge bg-surface-secondary text-brand-teal border border-border">
              Planning
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            {trip.origin} ✈ {trip.destination} • {members.length} Travelers • {itinerary.length} Itinerary Activities
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => setIsAddActivityOpen(true)}
            className="px-3 py-1.5 rounded-full bg-surface-secondary hover:bg-surface-elevated border border-border text-xs font-medium text-text-secondary hover:text-text-primary flex items-center gap-1.5 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-brand-blue" />
            <span>Add Event</span>
          </button>
          <button
            onClick={() => setIsContributionOpen(true)}
            className="px-3.5 py-1.5 rounded-full bg-brand-accent hover:bg-blue-400 text-background text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            <PiggyBank className="w-3.5 h-3.5" />
            <span>Deposit Savings</span>
          </button>
        </div>
      </div>

      {/* SECTION B & E: Trip Overview + Day Timeline & Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Upcoming Trip Overview (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <FeaturedTripHero onEditTrip={() => setIsEditTripOpen(true)} />
        </div>

        {/* Right: Timeline & KL Weather (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <SchedulePreviewCard onAddActivity={() => setIsAddActivityOpen(true)} />
          <WeatherCard />
        </div>
      </div>

      {/* SECTION C & D: Group Savings Progress + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Group Savings Progress (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <SavingsFinancialCard
            onAddContribution={() => setIsContributionOpen(true)}
            onEditBudget={() => setIsEditBudgetOpen(true)}
          />
        </div>

        {/* Recent Activity (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <RecentActivityCard />
        </div>
      </div>

      {/* SECTION F: Secondary Trip-Management Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MemberStackCard onInviteMember={() => setIsInviteOpen(true)} />
        <DestinationStackCard />
        <AccommodationCard />
        <PackingMiniCard onAddPackingItem={() => setIsAddPackingOpen(true)} />
      </div>

      {/* Interactive AI Collaborative Assistant & Plan Tabs */}
      <div className="pt-2">
        <AiPromptBar />
        <PlanTabs />
      </div>

      {/* Modals */}
      <AddContributionModal isOpen={isContributionOpen} onClose={() => setIsContributionOpen(false)} />
      <EditBudgetModal isOpen={isEditBudgetOpen} onClose={() => setIsEditBudgetOpen(false)} />
      <EditTripModal isOpen={isEditTripOpen} onClose={() => setIsEditTripOpen(false)} />
      <AddItineraryModal isOpen={isAddActivityOpen} onClose={() => setIsAddActivityOpen(false)} />
      <AddPackingItemModal isOpen={isAddPackingOpen} onClose={() => setIsAddPackingOpen(false)} />
      <AddNoteModal isOpen={isAddNoteOpen} onClose={() => setIsAddNoteOpen(false)} />
      <InviteMemberModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
    </div>
  );
};
