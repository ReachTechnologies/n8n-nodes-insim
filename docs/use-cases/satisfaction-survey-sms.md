# "We finish the job, leave, and never know if the customer was happy."

> **Persona**: Emma, quality manager at a home services company — Grenoble, France — 20 employees
> **Tool**: n8n + n8n-nodes-insim + Google Sheets
> **Setup time**: 1 hour
> **ROI estimate**: 62% survey response rate (vs 8% by email), early detection of service issues

## The problem

Emma manages quality at AlpServ, a company that handles plumbing, heating, and electrical work for residential customers. They complete about 40 interventions per week across the Grenoble area.

After each job, the technician closes the work order in their scheduling tool. That's it. No follow-up. No feedback. Emma sends a quarterly email survey — response rate: 8%. By the time someone complains about a bad experience, it's been weeks. The customer has already left a 1-star Google review. Or worse, they've silently churned and called a competitor next time.

Emma tried phone follow-up calls. At 40 interventions per week, that's a full day of calling — and half the customers don't pick up. She tried email surveys with Typeform: 8% response rate, mostly from satisfied customers. The unhappy ones don't bother clicking through a link, navigating to a form, and writing feedback. They just leave.

She needs something instant, effortless, and impossible to ignore. A single SMS sent 2 hours after the intervention: "How was our service? Reply 1 (bad) to 5 (excellent)." One tap to answer.

## The solution with inSIM

1. **Trigger** — When a technician marks a job complete in Google Sheets (or the scheduling tool fires a webhook), n8n starts the survey flow.
2. **Wait** — n8n waits 2 hours to give the customer time to evaluate the work.
3. **Send** — n8n sends a 1-question SMS survey via inSIM.
4. **Collect** — When the customer replies (1-5), inSIM receives the reply. n8n captures it via webhook, logs the score in Google Sheets, and tags the contact.
5. **Escalate** — If the score is 1 or 2, n8n immediately alerts Emma and the technician's manager.

## Workflow overview

**Outbound (send survey):**
```
[Webhook: job completed] → [Wait 2h] → [inSIM: Find by Phone] → [inSIM: Send SMS (survey)]
    → [inSIM: Manage Tags → "survey-sent"]
```

**Inbound (collect response):**
```
[Webhook: SMS received] → [Function: Parse score (1-5)] → [IF: valid score?]
    ↓ Yes
    [Google Sheets: Log score] → [inSIM: Manage Tags → "score-{{n}}"]
        → [IF: score <= 2] → [Slack: Alert #quality-urgent]
        → [IF: score >= 4] → [inSIM: Send SMS "Thank you!"]
    ↓ No (not a score)
    [Slack: Post to #support for manual handling]
```

## Key n8n nodes used

| Node | Purpose |
|------|---------|
| **Webhook** | Receives job completion event and SMS reply webhook |
| **Wait** | Delays survey by 2 hours after intervention |
| **inSIM: Contact > Find by Phone** | Looks up customer by phone number |
| **inSIM: SMS > Send** | Sends the survey question and thank-you follow-up |
| **inSIM: Contact > Manage Tags** | Tags contact with survey-sent, score-1 through score-5 |
| **Function** | Parses the SMS reply body to extract a score (1-5) |
| **IF** | Routes based on valid score, and escalates low scores |
| **Google Sheets** | Logs all responses with timestamp, technician, and score |
| **Slack** | Alerts quality team on low scores |

## SMS templates

**Survey (sent 2h after intervention):**
```
AlpServ: Comment s'est passee notre intervention aujourd'hui?
Repondez par un chiffre de 1 (mauvais) a 5 (excellent).
Votre avis nous aide a nous ameliorer!
```

**Thank you (score 4-5):**
```
Merci pour votre retour! Ravi que l'intervention vous ait satisfait.
N'hesitez pas a nous recommander. A bientot! — AlpServ
```

**Escalation alert (score 1-2, sent to Slack):**
```
:warning: Low satisfaction score
Customer: {{ firstname }} {{ lastname }} ({{ phone }})
Score: {{ score }}/5
Technician: {{ technician_name }}
Job: {{ job_description }}
Date: {{ job_date }}
Action needed: call customer within 2 hours.
```

## Google Sheets results log

| Date | Customer Phone | Technician | Job Type | Score | Tags |
|------|---------------|-----------|----------|-------|------|
| 2025-04-14 | +33600000001 | Marc D. | Plumbing | 5 | score-5 |
| 2025-04-14 | +33600000002 | Julien R. | Heating | 2 | score-2, escalated |
| 2025-04-14 | +33600000003 | Marc D. | Electrical | 4 | score-4 |

## Results

| Metric | Before (email survey) | After (SMS via inSIM) |
|--------|----------------------|-----------------------|
| Survey response rate | 8% | 62% |
| Time to receive feedback | 2-3 months (quarterly) | 2-4 hours |
| Low-score detection time | Weeks (or never) | Immediate (Slack alert) |
| Negative Google reviews per quarter | 6-8 | 1-2 (caught and resolved first) |
| Customer retention rate | 71% | 89% |

The key insight: unhappy customers will tap "2" in a text reply, but they won't fill out a Typeform. By making feedback effortless — one digit, one tap — Emma catches problems the same day. Three times this quarter, she called a dissatisfied customer within 2 hours of their reply, resolved the issue, and turned a potential 1-star review into a retained client.

## Related study cases

- [Support team: SMS-to-Slack routing](./sms-to-slack-support.md) — parent study case (inbound SMS handling via n8n)
- [Delivery: Package tracking notifications](./delivery-tracking-sms.md) — outbound status SMS with reply handling
- [Event marketer: Post-trade-show follow-up](./event-post-tradeshow.md) — multi-step SMS sequences with tagging
