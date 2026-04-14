# "12 clients. 12 weekly reports. Every Monday morning is a copy-paste marathon."

> **Persona**: Clara, account manager at a digital marketing agency — Nantes, France — 6 employees
> **Tool**: n8n + n8n-nodes-insim + Google Sheets
> **Setup time**: 1 hour
> **ROI estimate**: 3 hours saved per week, 0 missed reports, higher client retention

## The problem

Clara manages 12 clients at PixelPulse, a digital agency specializing in paid ads and SEO. Every Monday, each client expects a performance update: ad spend, leads generated, cost per lead, and any notable changes from the previous week.

Clara's current process: open Google Sheets (where the team logs weekly KPIs), scan each client's tab, write a summary, and send it by email. Some clients want email. Some want WhatsApp. Two of them specifically asked for SMS — "just text me the numbers, I'll read it between meetings."

It takes 3 hours every Monday. Some weeks, Clara forgets a client. Or she copies the wrong numbers from the wrong tab. Last quarter, a client received another client's stats and nearly churned.

She doesn't need a fancy dashboard. Her clients need a 3-line text with the numbers that matter, sent on time, every week, from a number they recognize.

## The solution with inSIM

1. **Trigger** — Every Monday at 8:30am, n8n reads each client's KPI row from Google Sheets.
2. **Format** — n8n formats the data into a concise SMS: spend, leads, CPL, and week-over-week change.
3. **Send** — n8n sends the personalized SMS to each client via inSIM from the agency's real number.
4. **Log** — n8n updates the Google Sheet with "SMS sent" status and timestamp.

## Workflow overview

```
[Schedule Trigger: Mon 8:30am] → [Google Sheets: Get rows] → [Loop: each client row]
    → [Function: Format report] → [inSIM: Send SMS] → [Google Sheets: Update status]
```

## Key n8n nodes used

| Node | Purpose |
|------|---------|
| **Schedule Trigger** | Fires every Monday at 8:30am |
| **Google Sheets** | Reads client KPI data and updates send status |
| **Loop Over Items** | Iterates through each client row |
| **Function** | Formats KPI data into a concise SMS message |
| **inSIM: SMS > Send** | Sends the report SMS to each client |
| **inSIM: Contact > Find by Phone** | Looks up client contact for personalization |
| **inSIM: Contact > Manage Tags** | Tags clients with `report-sent-{{week}}` |

## SMS template

```
{{ client_name }} Weekly Report ({{ week_date }}):
- Ad spend: {{ spend }}
- Leads: {{ leads }} ({{ leads_change }})
- CPL: {{ cpl }}
{{ comment }}
Reply with any questions! — Clara, PixelPulse
```

**Example output:**
```
BioMarket Weekly Report (Apr 7-13):
- Ad spend: 1,240 EUR
- Leads: 38 (+12% vs last week)
- CPL: 32.60 EUR
New campaign launched Wed, early results strong.
Reply with any questions! — Clara, PixelPulse
```

## Google Sheets structure

| Client | Phone | Spend | Leads | Leads Prev | CPL | Comment | SMS Status |
|--------|-------|-------|-------|-----------|-----|---------|-----------|
| BioMarket | +33600000001 | 1240 | 38 | 34 | 32.60 | New campaign Wed | |
| FitZone | +33600000002 | 890 | 22 | 25 | 40.45 | CTR dip, optimizing | |

After each send, n8n writes "Sent 2025-04-14 08:31" in the SMS Status column.

## Results

| Metric | Before (manual) | After (n8n + inSIM) |
|--------|-----------------|---------------------|
| Time spent on Monday reports | 3 hours | 0 (fully automated) |
| Missed or late reports per quarter | 4-5 | 0 |
| Data copy errors | 2-3 per quarter | 0 |
| Client satisfaction (NPS) | 32 | 61 |
| Client reply/engagement rate | 15% (email) | 58% (SMS) |

The unexpected benefit: clients started replying to the SMS with quick questions and feedback. "Can we push budget to 1500 next week?" or "What's driving the CPL increase?" Clara now has a lightweight client communication channel that doesn't require scheduling a call.

## Related study cases

- [Shopify: Abandoned cart SMS recovery](./shopify-abandoned-cart.md) — parent study case (automated SMS via n8n)
- [Event marketer: Post-trade-show follow-up](./event-post-tradeshow.md) — SMS drip sequences from n8n
- [Franchise: Multi-location campaigns](./franchise-multi-location.md) — segmented outbound SMS
