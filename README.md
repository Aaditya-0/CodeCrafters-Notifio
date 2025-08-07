# 🗓️ Event Reminder App

A modern, feature-rich event reminder application built with Next.js, TypeScript, and Tailwind CSS.

## ✨ Features

### Required Modules ✅
1. **Add New Event** - Create events with name, date, time, and description
2. **Display Upcom - Code Craftersing Events** - View all upcoming events in chronological order
3. **Visual Alerts** - Color-coded alerts and animations for events within 24 hours

### Optional Features ✅
- **MD Aman Monazirimer** - Real-time countdown for the next upcoming event
- **Divyanshu Karn - Data persistence using browser's local storage
- **Himanshu Thakur- SynFull Stack Developerme and updates every second
- **Aaditya Singhations** - Push notifications for urgent events
## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How to Use

### Adding Events
1. Click the "Add Event" button
2. Fill in the required fields:
   - **Event Name** (required)
   - **Date** (required, must be in the future)
   - **Time** (required)
   - **Description** (optional)
3. Click "Add Event" to save

### Managing Events
- View all upcoming events in the main list
- Events within 24 hours are highlighted with red styling
- Delete events by clicking the "Delete" button
- Real-time countdown shows time remaining for each event

### Notifications
- **Grant notification permissions** when prompted for best experience
- Events within 24 hours trigger browser notifications
- Sound alerts play at different urgency levels:
  - **High**: Events within 5-30 minutes
  - **Medium**: Events within 1 hour
  - **Low**: Events within 24 hours

## 🛠️ Technical Details

### Tech Stack
- **Frontend**: Next.js 15 with React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Storage**: Browser localStorage
- **Notifications**: Web Notifications API
- **Audio**: Web Audio API

### File Structure
```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── AddEventForm.tsx
│   ├── CountdownTimer.tsx
│   └── EventList.tsx
├── hooks/
│   ├── useEvents.ts
│   └── useNotifications.ts
└── types/
    └── event.ts
```

### Key Features Implementation

#### Real-time Updates
- Uses `setInterval` to update time every second
- Automatically refreshes countdown timers and urgency levels

#### Visual Alerts
- CSS animations and color changes for urgent events
- Responsive design with mobile-first approach

#### Smart Notifications
- Prevents duplicate notifications
- Different notification thresholds (5min, 30min, 1hr, 24hr)
- Auto-cleanup of old notification records

## 🎨 Styling & Animations

- **Gradient backgrounds** for countdown timer with urgency-based colors
- **Pulse animations** for urgent events
- **Smooth transitions** for all interactive elements
- **Responsive design** that works on desktop and mobile

## 📱 Browser Compatibility

- **Chrome/Edge**: Full support for all features
- **Firefox**: Full support for all features
- **Safari**: Full support (may need user interaction for audio)
- **Mobile browsers**: Responsive design with touch-friendly interface

## 🔧 Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 📋 Future Enhancements (Backend Ready)

The current implementation uses localStorage for persistence. When ready for backend integration:

- Replace localStorage with API calls
- Add Firebase integration for cloud storage
- Implement user authentication
- Add event sharing capabilities
- Export to calendar applications

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
