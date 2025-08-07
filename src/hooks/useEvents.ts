"use client";

import { useState, useEffect, useCallback } from 'react';
import { Event, NewEvent } from '@/types/event';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Load events from localStorage on mount
  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents).map((event: any) => ({
        ...event,
        createdAt: new Date(event.createdAt)
      }));
      setEvents(parsedEvents);
    }
  }, []);

  // Update current time every second for real-time countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Save events to localStorage whenever events change
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('events', JSON.stringify(events));
    }
  }, [events]);

  const addEvent = useCallback((newEvent: NewEvent) => {
    const event: Event = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...newEvent,
      createdAt: new Date()
    };
    setEvents(prev => [...prev, event]);
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
    // Update localStorage after deletion
    const updatedEvents = events.filter(event => event.id !== id);
    if (updatedEvents.length === 0) {
      localStorage.removeItem('events');
    } else {
      localStorage.setItem('events', JSON.stringify(updatedEvents));
    }
  }, [events]);

  const getUpcomingEvents = useCallback(() => {
    const now = new Date();
    return events
      .filter(event => {
        const eventDateTime = new Date(`${event.date}T${event.time}`);
        return eventDateTime > now;
      })
      .sort((a, b) => {
        const aDateTime = new Date(`${a.date}T${a.time}`);
        const bDateTime = new Date(`${b.date}T${b.time}`);
        return aDateTime.getTime() - bDateTime.getTime();
      });
  }, [events]);

  const getEventsWithin24Hours = useCallback(() => {
    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    return events.filter(event => {
      const eventDateTime = new Date(`${event.date}T${event.time}`);
      return eventDateTime > now && eventDateTime <= in24Hours;
    });
  }, [events]);

  const getNextEvent = useCallback(() => {
    const upcomingEvents = getUpcomingEvents();
    return upcomingEvents.length > 0 ? upcomingEvents[0] : null;
  }, [getUpcomingEvents]);

  const getTimeUntilEvent = useCallback((event: Event) => {
    const eventDateTime = new Date(`${event.date}T${event.time}`);
    const timeDiff = eventDateTime.getTime() - currentTime.getTime();
    
    if (timeDiff <= 0) return null;
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds };
  }, [currentTime]);

  return {
    events,
    currentTime,
    addEvent,
    deleteEvent,
    getUpcomingEvents,
    getEventsWithin24Hours,
    getNextEvent,
    getTimeUntilEvent
  };
};
