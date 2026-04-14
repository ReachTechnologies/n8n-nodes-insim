# "150 business cards collected at the trade show. Two weeks later, none converted."

> **Persona**: Hugo, event marketer at a B2B SaaS company — Lyon, France — 25 employees
> **Tool**: n8n + n8n-nodes-insim
> **Setup time**: 1 hour
> **ROI estimate**: 28% meeting booking rate vs 4% with email-only follow-up

## The problem

Hugo spent three days at SaaS Connect in Paris. His team collected 150 business cards, scanned badges, and had great conversations at the booth. Back at the office, the marketing assistant imports the contacts into HubSpot. Hugo writes a follow-up email: "Great meeting you at SaaS Connect!" — and sends it the next Monday.

Open rate: 22%. Click-through: 3%. Meetings booked: 6 out of 150. That's a 4% conversion rate on a €12,000 booth investment.

The problem isn't the message — it's the channel. After a trade show, every exhibitor sends the same generic email. Hugo's follow-up lands between 30 other "great meeting you" emails. By the time the prospect reads it (if they do), the conversation energy is gone. Hugo needs to reach people on the channel they actually check within minutes: SMS. But he doesn't want to send mass texts from a virtual number that screams marketing automation.

## The solution with inSIM

1. **Import** — After the show, Hugo uploads the scanned contacts to inSIM and adds them to a "SaaS Connect 2025" list.
2. **Day 0 — Thank you** — n8n triggers an immediate personalized SMS: "Hugo from Acme here — great chat about [topic] at SaaS Connect!"
3. **Day 3 — Value piece** — n8n sends a second SMS with a tracked link to a relevant case study or whitepaper.
4. **Day 7 — Meeting request** — n8n sends a final SMS with a Calendly link to book a demo.
5. **Track** — Each step tags the contact in inSIM. If they click or reply at any stage, the sequence adapts.

## Workflow overview

```
[Schedule Trigger: daily 9am] → [inSIM: Get Many contacts by list]
    → [IF: tag = "day0-pending"]  → [inSIM: Send SMS (thank you)]  → [inSIM: Manage Tags → "day0-sent"]
    → [IF: tag = "day3-pending"]  → [inSIM: Send SMS (content)]    → [inSIM: Manage Tags → "day3-sent"]
    → [IF: tag = "day7-pending"]  → [inSIM: Send SMS (meeting)]    → [inSIM: Manage Tags → "day7-sent"]
```

```
[Webhook: SMS reply received] → [inSIM: Find by Phone] → [inSIM: Manage Tags → "replied"]
    → [Slack: Post to #sales-leads]
```

## Key n8n nodes used

| Node | Purpose |
|------|---------|
| **Schedule Trigger** | Runs daily at 9am to process the sequence |
| **inSIM: List > Get Many** | Fetches contacts from the "SaaS Connect 2025" list |
| **inSIM: Contact > Manage Tags** | Tracks sequence stage (day0-sent, day3-sent, day7-sent, replied) |
| **inSIM: SMS > Send** | Sends each SMS in the drip sequence |
| **inSIM: Contact > Find by Phone** | Looks up replying contacts from webhook |
| **IF** | Routes contacts to the right message based on their current tag |
| **Slack** | Notifies sales team when a prospect replies |

## SMS templates

**Day 0** (sent same evening):
```
Hi {{ firstname }}, Hugo from Acme here. Great conversation at SaaS Connect
about your onboarding challenges. Text me anytime if you have questions!
```

**Day 3** (content piece):
```
{{ firstname }}, thought you'd find this relevant — we helped a company
in your space cut onboarding time by 60%: [link]
```

**Day 7** (meeting request):
```
{{ firstname }}, want to see how this could work for your team?
Pick a slot that works: [link] — happy to do 20 min. Hugo
```

## Results

| Metric | Email-only follow-up | SMS drip (inSIM) |
|--------|---------------------|------------------|
| Day-0 message open/read rate | 22% (email) | 92% (SMS) |
| Content piece click-through | 3% | 24% |
| Meeting booking rate | 4% (6/150) | 28% (42/150) |
| Cost per converted lead | €2,000 | €286 |
| Prospect reply rate | 1% | 18% |

The real unlock: 27 prospects replied directly to Hugo's SMS. Some asked questions, some negotiated timing, some forwarded to a colleague. These were real conversations from a real number — not a marketing blast from a short code.

## Related study cases

- [Shopify: Abandoned cart SMS recovery](./shopify-abandoned-cart.md) — parent study case (outbound SMS drip via n8n)
- [Agency: Automated client reporting by SMS](./agency-client-reporting.md) — scheduled SMS from data sources
- [Franchise: Multi-location campaigns](./franchise-multi-location.md) — segmented SMS by audience tags
