# Queue Seva 🚀

Queue Seva is a modern, premium SaaS queue management software. Built for businesses to digitize their waiting lists, enabling customers to skip the physical line and wait smarter through live queue tracking and virtual tokens. 

## Tech Stack
* **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Glassmorphism, Modern Apple-style Dark/Light Mode)
* **Animations:** [Framer Motion](https://www.framer.com/motion/)
* **Database & Auth:** [Firebase SDK](https://firebase.google.com/) (Firestore Real-time listeners & Firebase Auth)
* **Icons:** [Lucide Icons](https://lucide.dev/)

## Features
* **Vendor Onboarding:** Multi-vendor registration. Owners set up their shop profile and custom booking intervals (15/30/60 mins).
* **Slot Booking System:** Horizontal date-picking calendar with interactive time-slot grids reflecting live capacities.
* **Waitlist Flow:** "Cult.fit" style overflow waitlists when time slots reach max capacity.
* **Real-time Admin Dashboard:** Fast syncing vendor controller allowing shop owners to dispatch queues and slide customers into the "Serving Now" status. 
* **Pulse Animated Digital Tickets:** High-fidelity animated client tokens displaying live connection via Firestore. 

## Getting Started

First, run the development server:

```bash
npm run dev
# or for faster turbo mode:
npm run dev -- --turbo
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

For this setup, you need your own Firebase backend configurations added to a `.env.local` file at the root.

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```
