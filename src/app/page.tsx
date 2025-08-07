'use client';

import React, { useState } from 'react';

// Force client-side rendering
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/hooks/useEvents';
import { useNotifications } from '@/hooks/useNotifications';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle
} from '@/components/ResizableNavbar';
import { WavyBackground } from '@/components/Hero';

export default function Home() {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const router = useRouter();
  
  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  const {
    addEvent,
    deleteEvent,
    getUpcomingEvents,
    getEventsWithin24Hours,
    getNextEvent,
    getTimeUntilEvent,
    currentTime
  } = useEvents();

  const upcomingEvents = getUpcomingEvents();
  const eventsWithin24Hours = getEventsWithin24Hours();
  const nextEvent = getNextEvent();

  // Mobile menu state
  const [isOpen, setIsOpen] = useState(false);
  // Add Event Modal state
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);

  // Navigation items
  const navItems = [
    { name: "Dashboard", link: "/dashboard" },
    { name: "Events", link: "/events" },
  ];

  // Enable notifications and sound alerts
  useNotifications(eventsWithin24Hours, getTimeUntilEvent);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-32 w-32 border-4 border-cyan-400 border-t-transparent"></div>
          <div className="mt-4 text-cyan-300 font-mono">INITIALIZING NOTIFIO...</div>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Dashboard for authenticated users
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Futuristic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black"></div>
      <div className="absolute inset-0">
        <WavyBackground/>
      </div>
      
      {/* ResizableNavbar */}
      <Navbar className="bg-transparent fixed top-5 z-50">
        {/* Desktop Navbar */}
        <NavBody className="backdrop-blur-xl text-white border-0 bg-black/30">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25">
                <span className="text-black text-lg font-bold">⚡</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                NOTIFIO
              </h1>
            </div>
          </div>

          {/* Navigation Items */}
          <NavItems items={navItems} className=" text-white hover:text-white" />

          {/* Right Side */}
          <div className="flex items-center space-x-4 relative z-50">
            <div className="flex items-center space-x-2 text-sm text-cyan-400">
              <span>Welcome, {user?.name}</span>
            </div>
            <button 
              onClick={() => {
                console.log('Logout button clicked!');
                logout();
              }}
              className="relative z-50 flex items-center space-x-1 px-3 py-2 text-red-400 hover:text-red-300 font-medium transition-colors cursor-pointer hover:bg-red-500/10 rounded-lg border border-transparent hover:border-red-500/20 pointer-events-auto"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </NavBody>

        {/* Mobile Navbar */}
        <MobileNav className="bg-transparent backdrop-blur-xl text-white border-0">
          <MobileNavHeader>
            {/* Mobile Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <span className="text-black text-sm font-bold">⚡</span>
                </div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                  Notifio
                </h1>
                <div className="text-xs text-blue-400/70 font-mono">v2.0.47</div>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center space-x-4">
              <div className="text-xs text-cyan-400/80 font-mono bg-blue-900/30 px-2 py-1 rounded-full border border-blue-500/20">
                {currentTime.toLocaleString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <MobileNavToggle isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
            </div>
          </MobileNavHeader>

          {/* Mobile Menu */}
          <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)} className="bg-slate-900/95 backdrop-blur-xl border border-blue-500/20">
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-cyan-300 hover:text-white hover:bg-blue-500/10 rounded-lg transition-colors duration-200 border border-blue-500/10 hover:border-blue-500/30"
              >
                {item.name}
              </a>
            ))}
            <div className="mt-4 pt-4 border-t border-blue-500/20">
              <button 
                onClick={logout}
                className="flex items-center space-x-2 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      <main className="relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto h-full">
          {/* Hero Section */}
          <div className="text-center relative mb-16 h-screen flex justify-center items-center flex-col">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">NEVER</span>
              <span className="block text-white animate-pulse">
                MISS EVENTS
              </span>
            </h2>
            <p className="text-xl text-blue-200/80 max-w-3xl mx-auto mb-8 font-light">
              Effortlessly Keep Track of your Important Dates and Deadlines with NOTIFIO
              <span className="block text-cyan-400/70 text-base mt-2 font-mono">
                 Stay Organized and Stress Free, Every Day
              </span>
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-slate-900/80 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 shadow-2xl shadow-blue-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-cyan-400/70 uppercase tracking-wider mb-1">TOTAL EVENTS</p>
                  <p className="text-3xl font-bold text-white font-mono">{upcomingEvents.length.toString().padStart(2, '0')}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-blue-400/60 font-mono">SYNCHRONIZED</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                  <span className="text-blue-400 text-xl">⚡</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 shadow-2xl shadow-red-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-red-400/70 uppercase tracking-wider mb-1">CRITICAL EVENTS</p>
                  <p className="text-3xl font-bold text-white font-mono">{eventsWithin24Hours.length.toString().padStart(2, '0')}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-red-400/60 font-mono">HIGH PRIORITY</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center justify-center">
                  <span className="text-red-400 text-xl">🔥</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 shadow-2xl shadow-cyan-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-cyan-400/70 uppercase tracking-wider mb-1">NEXT TARGET</p>
                  <p className="text-lg font-bold text-white truncate font-mono">
                    {nextEvent ? nextEvent.name.toUpperCase() : 'NO TARGET'}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-cyan-400/60 font-mono">LOCKED ON</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-cyan-500/20 border border-cyan-500/30 rounded-xl flex items-center justify-center">
                  <span className="text-cyan-400 text-xl">🎯</span>
                </div>
              </div>
            </div>
          </div>

          {/* System Intel */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 shadow-2xl shadow-purple-500/10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3 font-mono">
              <span className="text-purple-400">🧠</span>
              SYSTEM INTEL
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3 p-3 bg-purple-500/5 border border-purple-500/10 rounded-lg">
                <span className="text-cyan-400 mt-0.5 font-mono">[01]</span>
                <span className="text-blue-200">Enable neural link notifications for instant alerts</span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-purple-500/5 border border-purple-500/10 rounded-lg">
                <span className="text-cyan-400 mt-0.5 font-mono">[02]</span>
                <span className="text-blue-200">Critical events trigger visual cortex enhancements</span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-purple-500/5 border border-purple-500/10 rounded-lg">
                <span className="text-cyan-400 mt-0.5 font-mono">[03]</span>
                <span className="text-blue-200">Audio frequencies adapt to threat assessment</span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-purple-500/5 border border-purple-500/10 rounded-lg">
                <span className="text-cyan-400 mt-0.5 font-mono">[04]</span>
                <span className="text-blue-200">Real-time temporal synchronization across dimensions</span>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="text-center text-cyan-400/60 text-sm font-mono mt-16">
            <p className="mb-4">
              <span className="text-purple-400">[NEXUS_CORE]</span> 
              Built with quantum architecture using Next.js, TypeScript, and Tailwind CSS
            </p>
            <div className="flex items-center justify-center gap-6 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-green-400">NEURAL LINK ACTIVE</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                <span className="text-blue-400">SYNC PROTOCOL ENABLED</span>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              // Temporal coordination system v2.0.47 • Quantum encryption active
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
