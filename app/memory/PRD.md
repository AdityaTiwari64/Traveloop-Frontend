# Traveloop PRD

## Original Problem
Travel website based on 14-screen mockup with skeuomorphism design and two-color palette (Sandy Beige + Ocean Blue) with multiple shades.

## Tech Stack
- React 19 + Tailwind + Shadcn/UI + lucide-react
- FastAPI + Motor (Mongo) + JWT Auth (bcrypt)

## Personas
- **Traveler**: plans trips, builds itineraries, tracks expenses, journals memories.
- **Admin**: manages users/trips/activities, monitors growth.

## Implemented (Feb 2026)
- JWT auth with httpOnly cookie + register/login/me/update
- 14 screens: Login, Register, Landing, Create Trip, Build Itinerary, Trip Listing, Profile, Search, Itinerary View w/ Budget, Community, Packing Checklist, Admin Panel, Trip Notes, Invoice
- CRUD: trips, sections, packing, notes, expenses, community
- Admin: user/trip/activity management + analytics with charts
- Seeded 8 destinations, 12 activities, demo user with 3 trips, community posts
- Skeuomorphic design system with Sandy Beige + Ocean Blue palette

## Backlog (P1/P2)
- AI travel suggestions integration
- Photo upload (object storage) for profile + community
- Trip sharing & invitations
- Stripe payments for booking
- Email notifications
