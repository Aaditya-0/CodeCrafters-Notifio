"use client";

import { Event } from '@/types/event';

interface CountdownTimerProps {
  nextEvent: Event | null;
  getTimeUntilEvent: (event: Event) => { days: number; hours: number; minutes: number; seconds: number } | null;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ nextEvent, getTimeUntilEvent }) => {
  if (!nextEvent) {
    return (
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">Next Event Countdown</h2>
        <div className="text-center py-8">
          <p className="text-lg opacity-90">No upcoming events to countdown to</p>
          <p className="text-sm opacity-75">Add an event to see the countdown timer!</p>
        </div>
      </div>
    );
  }

  const timeRemaining = getTimeUntilEvent(nextEvent);
  
  if (!timeRemaining) {
    return (
      <div className="bg-gradient-to-r from-red-500 to-orange-600 rounded-lg shadow-md p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">Next Event Countdown</h2>
        <div className="text-center py-8">
          <p className="text-lg">Event has started or passed!</p>
          <p className="text-xl font-bold">{nextEvent.name}</p>
        </div>
      </div>
    );
  }

  const { days, hours, minutes, seconds } = timeRemaining;

  const formatDateTime = (date: string, time: string) => {
    const eventDate = new Date(`${date}T${time}`);
    return eventDate.toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Determine urgency level for styling
  const totalHours = days * 24 + hours;
  let bgGradient = 'from-blue-500 to-purple-600';
  let pulseClass = '';
  
  if (totalHours <= 1) {
    bgGradient = 'from-red-500 to-red-700';
    pulseClass = 'animate-pulse';
  } else if (totalHours <= 24) {
    bgGradient = 'from-orange-500 to-red-600';
  } else if (totalHours <= 72) {
    bgGradient = 'from-yellow-500 to-orange-600';
  }

  return (
    <div className={`bg-gradient-to-r ${bgGradient} rounded-lg shadow-md p-6 text-white ${pulseClass}`}>
      <h2 className="text-2xl font-bold mb-4 text-center">🚀 Next Event Countdown</h2>
      
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">{nextEvent.name}</h3>
        <p className="text-sm opacity-90">📅 {formatDateTime(nextEvent.date, nextEvent.time)}</p>
        {nextEvent.description && (
          <p className="text-sm opacity-75 mt-1">📝 {nextEvent.description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
          <div className="text-3xl md:text-4xl font-bold">{days}</div>
          <div className="text-sm opacity-90">Day{days !== 1 ? 's' : ''}</div>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
          <div className="text-3xl md:text-4xl font-bold">{hours}</div>
          <div className="text-sm opacity-90">Hour{hours !== 1 ? 's' : ''}</div>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
          <div className="text-3xl md:text-4xl font-bold">{minutes}</div>
          <div className="text-sm opacity-90">Minute{minutes !== 1 ? 's' : ''}</div>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
          <div className="text-3xl md:text-4xl font-bold">{seconds}</div>
          <div className="text-sm opacity-90">Second{seconds !== 1 ? 's' : ''}</div>
        </div>
      </div>

      {totalHours <= 24 && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/30 rounded-full">
            <span className="mr-2">⚠️</span>
            <span className="font-semibold">
              {totalHours <= 1 ? 'URGENT: Less than 1 hour remaining!' : 'Event within 24 hours!'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
