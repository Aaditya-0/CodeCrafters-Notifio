"use client";

import { Event } from '@/types/event';

interface EventListProps {
  events: Event[];
  eventsWithin24Hours: Event[];
  onDeleteEvent: (id: string) => void;
  getTimeUntilEvent: (event: Event) => { days: number; hours: number; minutes: number; seconds: number } | null;
}

export const EventList: React.FC<EventListProps> = ({ 
  events, 
  eventsWithin24Hours, 
  onDeleteEvent,
  getTimeUntilEvent 
}) => {
  const upcomingEvents = events;
  
  const isEventWithin24Hours = (eventId: string) => {
    return eventsWithin24Hours.some(event => event.id === eventId);
  };

  const formatDateTime = (date: string, time: string) => {
    const eventDate = new Date(`${date}T${time}`);
    return eventDate.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatTimeRemaining = (event: Event) => {
    const timeRemaining = getTimeUntilEvent(event);
    if (!timeRemaining) return 'Event has passed';

    const { days, hours, minutes, seconds } = timeRemaining;
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  if (upcomingEvents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Events</h2>
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg mb-2">No upcoming events</p>
          <p>Add your first event using the form above!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Upcoming Events ({upcomingEvents.length})
      </h2>
      
      {/* Alert for events within 24 hours */}
      {eventsWithin24Hours.length > 0 && (
        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 rounded-md">
          <div className="flex items-center mb-2">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                ⚠️ {eventsWithin24Hours.length} event{eventsWithin24Hours.length > 1 ? 's' : ''} within 24 hours!
              </h3>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {upcomingEvents.map((event) => {
          const isUrgent = isEventWithin24Hours(event.id);
          
          return (
            <div
              key={event.id}
              className={`p-4 rounded-lg border transition-all duration-300 ${
                isUrgent 
                  ? 'bg-red-50 border-red-300 shadow-lg transform scale-105' 
                  : 'bg-gray-50 border-gray-200 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={`text-xl font-semibold ${isUrgent ? 'text-red-800' : 'text-gray-800'}`}>
                      {event.name}
                    </h3>
                    {isUrgent && (
                      <span className="px-2 py-1 bg-red-200 text-red-800 text-xs font-bold rounded-full animate-pulse">
                        URGENT
                      </span>
                    )}
                  </div>
                  
                  <div className={`text-sm mb-2 ${isUrgent ? 'text-red-700' : 'text-gray-600'}`}>
                    📅 {formatDateTime(event.date, event.time)}
                  </div>
                  
                  {event.description && (
                    <div className={`text-sm mb-3 ${isUrgent ? 'text-red-600' : 'text-gray-500'}`}>
                      📝 {event.description}
                    </div>
                  )}
                  
                  <div className={`text-sm font-mono ${isUrgent ? 'text-red-800 font-bold' : 'text-blue-600'}`}>
                    ⏰ Time remaining: {formatTimeRemaining(event)}
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this event?')) {
                      onDeleteEvent(event.id);
                    }
                  }}
                  className="ml-4 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
