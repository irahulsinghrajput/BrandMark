# BrandMark lead capture (n8n + Claude)

```
Contact page form ──► /api/leads/strategy ──► MongoDB (saved first, never lost)
                                         └──► n8n webhook ──► Claude sorts it ──► Google Sheet row
                                                                              └──► Email to the team
```

1. A visitor fills in **Request Strategy Outline** on `/contact` and ticks the consent box.
2. The website saves the enquiry and the consent text in MongoDB (`strategyrequests` collection).
3. The website sends it to n8n with a secret header.
4. n8n asks Claude (`claude-opus-5-5`, low effort) to give it a priority (Hot / Warm / Cold), a short summary, recommended services, a next step, a draft first reply and a spam flag.
5. n8n adds a row to the **Leads** Google Sheet and emails `contact@brandmarksolutions.site`.

Nothing is sent to the customer automatically. The draft reply is for Rahul to check and send.

## Setup (one time, about 20 minutes)

### 1. Claude API key
- Create a key at console.anthropic.com → API keys. Usage is billed per request. At Claude Opus 5.5 prices ($4 per million input tokens, $20 per million output tokens), sorting one enquiry is roughly ₹1–3. That is an estimate; check the Console's usage page after the first few runs.
- In n8n: **Credentials → New → Header Auth**. Name: `Anthropic API key`. Header name: `x-api-key`. Value: your key.

### 2. Webhook secret
- Make a long random string (for example 40 letters and numbers).
- In n8n: **Credentials → New → Header Auth**. Name: `BrandMark lead webhook secret`. Header name: `x-webhook-secret`. Value: the string.

### 3. Google Sheet
- Create a Google Sheet with a tab named **Leads** and this header row (row 1):
  `received_at, lead_id, priority, name, company, email, phone, city, budget, services_asked, website, message, ai_summary, ai_reason, recommended_services, next_step, draft_reply, likely_spam, status`
- Share it only with the team. It holds personal data.

### 4. Import the workflow
- n8n → **Workflows → Import from file** → `brandmark-lead-capture.json`.
- Open each node and choose the credential:
  - **New enquiry (from website):** `BrandMark lead webhook secret`
  - **Ask Claude to sort it:** `Anthropic API key`
  - **Add row to Leads sheet:** your Google account, then paste the sheet's URL
  - **Email the team:** your Gmail account (change the address if needed)
- Click **Activate**. Copy the **Production URL** from the webhook node (it ends in `/webhook/brandmark-lead`).

### 5. Tell the website
In Vercel → Project → Settings → Environment Variables (Production), add:

| Name | Value |
|---|---|
| `N8N_LEAD_WEBHOOK_URL` | the Production URL from step 4 |
| `N8N_LEAD_WEBHOOK_SECRET` | the string from step 2 |

Then redeploy. Until these are set, enquiries are still saved in MongoDB, marked `not_configured`.

### 6. Test
Submit the form on `/contact` with your own details. Within a minute you should see a new sheet row and an email. In n8n → **Executions** you can see each run.

## If n8n was asleep or down
The website waits up to 8 seconds for n8n. If n8n doesn't answer (a free Render instance can take longer to wake up), the enquiry stays saved and is marked `failed`. To find and resend them (admin login needed):

- `GET /api/leads/strategy?automation=failed` lists them
- `POST /api/leads/strategy/<id>/forward` sends one again

To avoid this, run n8n on a plan that doesn't sleep (n8n Cloud, or a paid Render instance).

## Notes
- **Refusal fallback:** the Claude request has the server-side refusal fallback switched on (`fallbacks: "default"`, beta header `server-side-fallback-2026-07-01`). If Claude declines a request, the API retries it on a suitable model automatically. If you'd rather not use it, delete that header and the `fallbacks` line.
- **When Claude can't be reached:** if Claude errors, the row and email still go out, marked **Review manually**.
- **Consent wording:** the text is in `backend/routes/leads.js` and `brandmark-react/src/components/LeadCaptureForm.jsx`. If you change it, change both, and bump `CONSENT_VERSION`.
