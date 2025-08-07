"use client";

import { useEffect, useRef } from 'react';
import { Event } from '@/types/event';

export const useNotifications = (eventsWithin24Hours: Event[], getTimeUntilEvent: (event: Event) => any) => {
  const notifiedEvents = useRef<Set<string>>(new Set());
  const audioContextRef = useRef<AudioContext | null>(null);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Initialize audio context for sound alerts
  useEffect(() => {
    const initAudioContext = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };

    // Initialize on first user interaction
    const handleUserInteraction = () => {
      initAudioContext();
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  // Play notification sound
  const playNotificationSound = (urgency: 'low' | 'medium' | 'high') => {
    if (!audioContextRef.current) return;

    try {
      const context = audioContextRef.current;
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      // Different tones based on urgency
      let frequency = 800; // Default
      let duration = 0.3;
      
      switch (urgency) {
        case 'high':
          frequency = 1000;
          duration = 0.5;
          break;
        case 'medium':
          frequency = 850;
          duration = 0.4;
          break;
        case 'low':
          frequency = 700;
          duration = 0.2;
          break;
      }

      oscillator.frequency.setValueAtTime(frequency, context.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, context.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration);

      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + duration);
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  };

  // Show browser notification
  const showBrowserNotification = (event: Event, urgency: 'low' | 'medium' | 'high') => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const timeRemaining = getTimeUntilEvent(event);
      let timeText = 'soon';
      
      if (timeRemaining) {
        const { days, hours, minutes } = timeRemaining;
        if (days > 0) {
          timeText = `in ${days}d ${hours}h ${minutes}m`;
        } else if (hours > 0) {
          timeText = `in ${hours}h ${minutes}m`;
        } else {
          timeText = `in ${minutes}m`;
        }
      }

      const urgencyEmoji = {
        high: '🚨',
        medium: '⚠️',
        low: '📅'
      };

      const notification = new Notification(`${urgencyEmoji[urgency]} Event Reminder`, {
        body: `${event.name} ${timeText}\n${event.description || ''}`,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: event.id,
        requireInteraction: urgency === 'high',
        silent: false
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto close after 5 seconds for low/medium priority
      if (urgency !== 'high') {
        setTimeout(() => notification.close(), 5000);
      }
    }
  };

  // Check for events that need notifications
  useEffect(() => {
    eventsWithin24Hours.forEach(event => {
      const timeRemaining = getTimeUntilEvent(event);
      if (!timeRemaining) return;

      const { days, hours, minutes } = timeRemaining;
      const totalMinutes = days * 24 * 60 + hours * 60 + minutes;
      const notificationKey = `${event.id}-${Math.floor(totalMinutes / 60)}`; // Notify once per hour

      if (notifiedEvents.current.has(notificationKey)) return;

      let shouldNotify = false;
      let urgency: 'low' | 'medium' | 'high' = 'low';

      // Notification thresholds
      if (totalMinutes <= 5) {
        shouldNotify = true;
        urgency = 'high';
      } else if (totalMinutes <= 30) {
        shouldNotify = true;
        urgency = 'medium';
      } else if (totalMinutes <= 60) {
        shouldNotify = true;
        urgency = 'medium';
      } else if (totalMinutes <= 60 * 24) { // 24 hours
        // Only notify once when entering 24-hour window
        const key24h = `${event.id}-24h`;
        if (!notifiedEvents.current.has(key24h)) {
          shouldNotify = true;
          urgency = 'low';
          notifiedEvents.current.add(key24h);
        }
      }

      if (shouldNotify) {
        notifiedEvents.current.add(notificationKey);
        
        // Show browser notification
        showBrowserNotification(event, urgency);
        
        // Play sound alert
        setTimeout(() => playNotificationSound(urgency), 100);
        
        // For high urgency, play multiple sounds
        if (urgency === 'high') {
          setTimeout(() => playNotificationSound(urgency), 600);
          setTimeout(() => playNotificationSound(urgency), 1200);
        }
      }
    });
  }, [eventsWithin24Hours, getTimeUntilEvent]);

  // Clean up old notifications from memory
  useEffect(() => {
    const cleanup = () => {
      const currentEventIds = new Set(eventsWithin24Hours.map(e => e.id));
      const keysToDelete: string[] = [];
      
      notifiedEvents.current.forEach(key => {
        const eventId = key.split('-')[0];
        if (!currentEventIds.has(eventId)) {
          keysToDelete.push(key);
        }
      });
      
      keysToDelete.forEach(key => notifiedEvents.current.delete(key));
    };

    cleanup();
  }, [eventsWithin24Hours]);

  return {
    playNotificationSound,
    showBrowserNotification
  };
};
