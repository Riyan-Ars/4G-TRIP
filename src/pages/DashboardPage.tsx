import React, { useState } from 'react';
import { FeaturedTripHero } from '../components/dashboard/FeaturedTripHero';
import { SchedulePreviewCard } from '../components/dashboard/SchedulePreviewCard';
import { MapPreviewCard } from '../components/dashboard/MapPreviewCard';
import { WeatherCard } from '../components/dashboard/WeatherCard';
import { AccommodationCard } from '../components/dashboard/AccommodationCard';
import { SavingsFinancialCard } from '../components/dashboard/SavingsFinancialCard';
import { DestinationStackCard } from '../components/dashboard/DestinationStackCard';
import { MemberStackCard } from '../components/dashboard/MemberStackCard';
import { QuoteNoteCard } from '../components/dashboard/QuoteNoteCard';
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
  const [isContributionOpen, setIsContributionOpen] = useState(false);
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState(false);
  const [isEditTripOpen, setIsEditTripOpen] = useState(false);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [isAddPackingOpen, setIsAddPackingOpen] = useState(false);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  return (
    <div className="max-w-[1520px] mx-auto space-y-6 animate-fade-in">
      {/* SECTION 1: Bento Matrix Upper Section (Matches Reference Image Composition) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Featured Trip Panoramic Hero Card (7 columns on desktop) */}
        <div className="lg:col-span-7 flex flex-col">
          <FeaturedTripHero onEditTrip={() => setIsEditTripOpen(true)} />
        </div>

        {/* Right Top Bento Grid (5 columns on desktop) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Top row of right section: Schedule + Map + Weather */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SchedulePreviewCard onAddActivity={() => setIsAddActivityOpen(true)} />
            <div className="flex flex-col gap-4">
              <MapPreviewCard />
              <WeatherCard />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Middle Bento Row (Accommodation, Member Tilt Card & Quote) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Accommodation Spotlight Card (6 cols) */}
        <div className="md:col-span-6 flex flex-col">
          <AccommodationCard />
        </div>

        {/* Squad Leader Tilt Card (3 cols) */}
        <div className="md:col-span-3 flex flex-col">
          <MemberStackCard onInviteMember={() => setIsInviteOpen(true)} />
        </div>

        {/* Group Chatter Quote Card (3 cols) */}
        <div className="md:col-span-3 flex flex-col">
          <QuoteNoteCard onAddNote={() => setIsAddNoteOpen(true)} />
        </div>
      </div>

      {/* SECTION 3: Financial Breakdown, Destination Stack & Packing Essentials */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Savings & Category Breakdown (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <SavingsFinancialCard
            onAddContribution={() => setIsContributionOpen(true)}
            onEditBudget={() => setIsEditBudgetOpen(true)}
          />
        </div>

        {/* Center: Overlapping Destination Stack Cards (3 cols) */}
        <div className="lg:col-span-3 flex flex-col">
          <DestinationStackCard />
        </div>

        {/* Right: Mandatory Packing Mini Checklist (4 cols) */}
        <div className="lg:col-span-4 flex flex-col">
          <PackingMiniCard onAddPackingItem={() => setIsAddPackingOpen(true)} />
        </div>
      </div>

      {/* SECTION 4: AI Collaborative Prompt Bar & Plan Tabs */}
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
