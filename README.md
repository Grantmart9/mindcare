# MindCare: Frontend Mental Health Support App

A React/Next.js frontend application for mental health support with mood tracking, journaling, and therapeutic features.

## 🚀 Features

- **Mood Tracking**: Daily mood check-ins with visual charts
- **AI Journal**: AI-powered journaling with insights
- **Therapeutic Chatbot**: Conversational AI for mental health support
- **Habit Building**: Track and build healthy habits
- **Peer Support**: Connect with others in peer support groups
- **Personalized Recommendations**: Get tailored CBT exercises and resources
- **Clinician Dashboard**: For healthcare providers to monitor patients

## 📁 Project Structure

```
mindcare/
│
├── README.md               # This file
├── package.json            # Node.js dependencies
├── next.config.ts          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── components.json         # shadcn/ui configuration
├── eslint.config.mjs       # ESLint configuration
├── postcss.config.mjs      # PostCSS configuration
├── tsconfig.json           # TypeScript configuration
│
├── public/                 # Static assets
│   ├── favicon.ico
│   └── *.svg
│
├── src/
│   ├── app/                # Next.js app directory
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles
│   │
│   ├── components/         # React components
│   │   ├── ui/             # Reusable UI components (shadcn/ui)
│   │   ├── mood/           # Mood tracking components
│   │   ├── journal/        # Journaling components
│   │   ├── chat/           # Chatbot components
│   │   ├── clinician/      # Clinician dashboard
│   │   ├── analytics/      # Analytics and charts
│   │   ├── gamification/   # Achievement system
│   │   ├── habits/         # Habit tracking
│   │   ├── peersupport/    # Peer support groups
│   │   ├── recommendations/ # Personalized recommendations
│   │   ├── screening/      # Mental health screenings
│   │   └── common/         # Shared components
│   │
│   └── lib/                # Utilities and services
│       ├── utils.ts        # Utility functions
│       ├── types/          # TypeScript type definitions
│       ├── services/       # API services (mocked for frontend-only)
│       └── data/           # Static data and constants
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:3000

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React hooks (useState, useContext)
- **Charts**: Recharts
- **Icons**: Lucide React

## 🆘 Crisis Resources

- **988 Suicide & Crisis Lifeline**: Call or text 988
- **Crisis Text Line**: Text HOME to 741741
- **National Suicide Prevention Lifeline**: 1-800-273-TALK (8255)

---

**⚠️ Important Disclaimer**: This software is not a substitute for professional medical care. Always consult with qualified healthcare providers for mental health concerns. In case of emergency, call 988 or go to your nearest emergency room.
