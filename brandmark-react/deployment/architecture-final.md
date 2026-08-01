# BM-OS Final Architecture Map

## Overview
BM-OS operates as a headless, event-driven, AI-native operating system. It relies heavily on Supabase for data/state and n8n for logic orchestration, with a React SPA acting purely as the presentation layer.

## Component Map

### 1. Presentation Layer (React + Vite)
- **Admin Portal (`/admin/*`)**: CRM, Sales, Finances, Project Delivery, Settings, Analytics.
- **Client Portal (`/portal/*`)**: Dedicated unified interface for authenticated clients.
- **Public Site (`/`)**: Landing pages, SEO blogs, AI generation targets.

### 2. State Layer (Supabase PostgreSQL)
- **Schemas**: 14 distinct SQL migrations.
- **Vectors**: `pgvector` utilized for Knowledge Base (RAG).
- **Security**: 100% Row Level Security (RLS). No backend API exists to bypass this; the frontend connects directly using secure JWTs.
- **Realtime**: WebSockets enabled on `team_messages` and `activity_feed`.

### 3. Logic & Orchestration Layer (n8n)
- **Role**: Replaces a traditional Node/Python backend.
- **Trigger**: Listens to Supabase Webhooks or schedule-based crons.
- **Action**: Executes API calls (OpenAI, Resend, Slack) and writes results back to Supabase via `service_role`.

### 4. AI Engine (OpenAI)
- **Generative**: `gpt-4o` for proposals, marketing, and health summaries.
- **Retrieval**: `text-embedding-3-large` for RAG vectorization inside Supabase.

### 5. Third-Party Edge Nodes
- **Slack**: Critical alerts and team notifications.
- **Resend**: Transactional emails (Welcome, Invoices).
- **Google Drive**: Client folder generation.

## Security Posture
- **Zero Trust**: React frontend assumes it has zero privileges until Supabase Auth validates the JWT.
- **Config as Data**: System settings (Module 14) are stored in the database, meaning n8n logic can adapt dynamically without code changes.
