# "SMS from customers land on 5 different phones. Nobody knows who replied to what."

> **Persona**: Amina, support team lead at a maintenance services company — Toulouse, France — 12 employees
> **Tool**: n8n + n8n-nodes-insim + Slack
> **Setup time**: 1 hour
> **ROI estimate**: 0 lost messages, response time from 2h to 12 min, full audit trail

## The problem

Amina manages a team of 5 field technicians at ClimaPro, an HVAC maintenance company. Customers text the company to schedule repairs, ask about estimates, or report urgent breakdowns.

The problem: each technician has a company phone. When a customer texts, it lands on one phone. That technician might be on a roof installing an AC unit and won't check messages for hours. Or they're on vacation and nobody sees the message at all.

There's no central inbox. No way to know if a message was handled. No history of who said what to whom. Last month, they lost a €4,500 contract because a building manager's urgent request sat unread for 3 days on a technician's phone that was in a drawer.

Amina tried shared email, but customers don't email — they text. She tried a shared Google Voice number, but customers want to call and text the same number they've always used. She needs incoming SMS from the company's real number to land in Slack, where the whole team can see and respond.

## The solution with inSIM

1. **Webhook** — inSIM sends a webhook to n8n every time an SMS is received on the company phone.
2. **Enrich** — n8n looks up the sender in inSIM contacts to get their name, tags, and history.
3. **Route** — n8n posts the message to the right Slack channel based on the contact's tags (VIP → #urgent, regular → #support).
4. **Respond** — A team member reads the message in Slack and types a reply. n8n picks up the reply and sends it as an SMS via inSIM.
5. **Track** — Every interaction is logged. The contact is tagged with the response status.

## Implementation

### Prerequisites

- inSIM app installed on the company phone
- inSIM account with API access and webhook configuration
- n8n instance (self-hosted or cloud)
- n8n-nodes-insim installed (Settings > Community Nodes > `n8n-nodes-insim`)
- Slack workspace with incoming webhook or bot token

### Workflow overview

**Inbound flow (SMS → Slack):**
```
[Webhook: SMS received] → [inSIM: Find Contact] → [inSIM: Get Conversation] → [Slack: Post Message]
```

**Outbound flow (Slack → SMS):**
```
[Slack: Slash command /sms] → [n8n Webhook] → [inSIM: Send SMS] → [Slack: Confirm]
```

### Step 1: Configure inSIM webhook

First, set up the inSIM webhook to notify n8n when an SMS is received.

In n8n, create a **Webhook** node:
- Method: POST
- Path: `/insim-sms-received`
- Copy the webhook URL

Then configure the webhook in inSIM. You can use the CLI:

```bash
insim account webhooks-set --sms "https://your-n8n.example.com/webhook/insim-sms-received"
```

Or use the **inSIM** node in n8n:
- Resource: **Account**
- Operation: **Configure Webhooks**
- SMS Webhook URL: your n8n webhook URL

### Step 2: Look up the sender

When an SMS webhook arrives, the payload includes the sender's phone number.

Add an **inSIM** node:
- Resource: **Contact**
- Operation: **Search**
- Query: `{{ $json.phone_number }}`

This returns the contact's name, tags, and ID. If the contact doesn't exist, you'll get an empty result — you can create them automatically.

### Step 3: Get conversation context

Add an **inSIM** node:
- Resource: **SMS**
- Operation: **Get Conversation**
- Phone Number: `{{ $json.phone_number }}`
- Limit: 5

This gives the support team the last 5 messages in the thread, so they have context before replying.

### Step 4: Post to Slack

Add a **Slack** node:
- Operation: Send Message
- Channel: Route based on contact tags:
  - Tag contains "vip" or "urgent" → `#support-urgent`
  - Default → `#support-general`
- Message format:

```
📱 *New SMS from {{ $json.contact.firstname }} {{ $json.contact.lastname }}*
Phone: {{ $json.phone_number }}
Tags: {{ $json.contact.tags }}

> {{ $json.message }}

_Recent conversation:_
{{ $json.conversation }}

Reply with `/sms {{ $json.phone_number }} Your reply here`
```

### Step 5: Reply from Slack

Create a second workflow for outbound replies.

**Webhook** node:
- Receives Slack slash command `/sms +33612000001 Your reply here`
- Parses phone number and message from the command text

**inSIM** node:
- Resource: **SMS**
- Operation: **Send**
- Phone Number: parsed from slash command
- Message: parsed from slash command

**Slack** node:
- Post confirmation: "SMS sent to +33612000001"

### Step 6: Tag the contact

After sending a reply, add an **inSIM** node:
- Resource: **Contact**
- Operation: **Manage Tags**
- Action: Add
- Tags: `replied`, `support-handled`

For messages that haven't been replied to after 2 hours, a scheduled workflow can tag them `needs-attention` and post a reminder in Slack.

### Escalation workflow (optional)

```
[Schedule Trigger: every 2h] → [inSIM: List SMS inbound] → [Filter: no reply in 2h]
    → [Slack: Post reminder to #support-urgent]
    → [inSIM: Manage Tags → "escalated"]
```

## Results

| Metric | Before (5 phones) | After (Slack + inSIM) |
|--------|-------------------|----------------------|
| Lost messages/month | 8-12 | 0 |
| Average response time | 2 hours | 12 minutes |
| Messages with no reply | ~15% | 0% (escalation catches all) |
| Team visibility | None (each phone isolated) | 100% (everything in Slack) |
| Audit trail | None | Full history in Slack + inSIM |
| Customer satisfaction | 3.2/5 | 4.4/5 |

The game changer: customers still text the same number they've always used. They don't know anything changed. But now, the entire team sees every message, and nobody falls through the cracks.

### Before vs. After

**Before**: Customer texts technician → technician is busy → message sits for hours → customer calls competitor → lost contract.

**After**: Customer texts same number → n8n routes to Slack instantly → any team member responds → customer gets answer in 12 minutes → contract saved.

## Variations

- [Delivery support: Package tracking via SMS](./delivery-tracking-sms.md) *(coming soon)*
- [Field maintenance: Appointment booking via SMS](./maintenance-appointment-sms.md) *(coming soon)*
- [After-sales: Satisfaction survey via SMS](./satisfaction-survey-sms.md) *(coming soon)*

## Related study cases

- [Shopify: Abandoned cart SMS recovery](./shopify-abandoned-cart.md) — n8n workflow for outbound SMS automation
- [E-commerce: AI night support via MCP](../../../insim-mcp/docs/use-cases/ecommerce-night-support.md) — AI-powered SMS response with MCP
