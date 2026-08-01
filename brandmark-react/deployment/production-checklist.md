# BM-OS Production Checklist

## Database (Supabase)
- [ ] All 14 migration files executed successfully.
- [ ] RLS policies applied to ALL tables.
- [ ] `anon` key verified to have NO access to secure tables.
- [ ] Point-in-time recovery (PITR) enabled.

## Orchestration (n8n)
- [ ] Production instance deployed and accessible.
- [ ] Basic Auth or SSO enabled for the n8n dashboard.
- [ ] Credentials (OpenAI, Supabase, Slack, Resend) securely injected.
- [ ] Webhooks configured and verified.
- [ ] Cron jobs verified (Daily Health, Weekly Backups).

## Frontend (React/Vite)
- [ ] `.env.production` populated with live API keys.
- [ ] `npm run build` executes without chunk errors.
- [ ] Bundle size optimized (lazy loading verified).
- [ ] Nginx routing configured for React SPA (`try_files`).

## Security & Integrations
- [ ] JWT roles (`admin`, `service_role`, `client`) mapped correctly.
- [ ] OpenAI API limits and billing alerts configured.
- [ ] Slack `#admin-alerts` channel integration verified.

## Final Sign-Off
- [ ] Admin Dashboard loaded.
- [ ] System Health Dashboard shows 15/15 green modules.
- [ ] End-to-end Client Onboarding test passed.
