import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileNav } from './MobileNav';
import { AddNoteModal } from '../modals/AddNoteModal';
import { InviteMemberModal } from '../modals/InviteMemberModal';

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background text-text-primary overflow-hidden font-sans">
      {/* Desktop Persistent Sidebar */}
      <Sidebar className="hidden lg:flex" />

      {/* Mobile Drawer Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
            onClick={() => setMobileMenuOpen(false)} 
          />
          <Sidebar 
            className="relative z-10 w-72" 
            onCloseMobile={() => setMobileMenuOpen(false)} 
          />
        </div>
      )}

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <TopBar
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenAddNote={() => setIsAddNoteOpen(true)}
          onOpenInvite={() => setIsInviteOpen(true)}
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-7 pb-24 lg:pb-12 space-y-6">
          <Outlet context={{ openInvite: () => setIsInviteOpen(true) }} />
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileNav onOpenSidebar={() => setMobileMenuOpen(true)} />
      </div>

      {/* Global Modals */}
      <AddNoteModal isOpen={isAddNoteOpen} onClose={() => setIsAddNoteOpen(false)} />
      <InviteMemberModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
    </div>
  );
};
