# "40% of carts abandoned. Email recovery gets 12% open rate. SMS gets 45%."

> **Persona**: Lea, growth marketer at a cosmetics e-commerce — Bordeaux, France — 8 employees
> **Tool**: n8n + n8n-nodes-insim
> **Setup time**: 45 minutes
> **ROI estimate**: +18% cart recovery rate, €3,200/month additional revenue

## The problem

Lea manages growth at Belle Naturelle, an organic cosmetics brand selling through Shopify. Their average cart value is €65, and 40% of carts are abandoned — that's roughly €26,000/month walking out the door.

She has automated email recovery. It works, but barely: 12% open rate, 3% click-through, 1.5% conversion. Customers are drowning in promotional emails. Her abandoned cart emails land between a Netflix notification and a LinkedIn update.

She's looked at SMS providers. Twilio charges €0.07 per SMS with a virtual number. At 400 abandoned carts/month, that's €28/month in SMS costs — affordable — but the virtual number is the real problem. Customers see an unknown short code, assume it's spam, and ignore it. When they try to reply, it goes to a dead end.

Lea wants SMS recovery from the company's real phone number. The same number printed on their packaging and business cards. The one customers already have in their contacts.

## The solution with inSIM

1. **Trigger** — Shopify fires a webhook when a cart is abandoned for more than 30 minutes.
2. **Wait** — n8n waits 1 hour. If the customer completes the purchase in that window, do nothing.
3. **Check** — n8n queries Shopify to verify the order is still unpaid.
4. **Personalize** — n8n looks up the customer in inSIM to get their first name and history.
5. **Send** — n8n sends a personalized SMS via inSIM with a tracked discount link.
6. **Track** — If the customer clicks the link, n8n tags them as "hot lead" in inSIM for future campaigns.

## Implementation

### Prerequisites

- inSIM app installed on the company phone
- inSIM account with API access
- n8n instance (self-hosted or cloud)
- n8n-nodes-insim installed (Settings > Community Nodes > `n8n-nodes-insim`)
- Shopify store with webhook access

### Workflow overview

```
[Shopify Webhook] → [Wait 1h] → [Shopify: Check Order] → [IF: Still unpaid?]
                                                              ↓ Yes
                                    [inSIM: Find by Phone] → [inSIM: Send SMS] → [inSIM: Manage Tags]
```

### Step 1: Shopify webhook trigger

In n8n, add a **Webhook** node:
- Method: POST
- Path: `/shopify-abandoned-cart`
- Authentication: Header Auth (X-Shopify-Hmac-Sha256)

Configure Shopify to send `carts/update` webhooks to your n8n webhook URL.

The webhook payload includes:
- `customer.phone` — the customer's phone number
- `customer.first_name` — for personalization
- `line_items[].title` — product names
- `total_price` — cart value

### Step 2: Wait node

Add a **Wait** node:
- Wait for: 1 hour
- This gives the customer time to complete the purchase on their own.

### Step 3: Check if order was completed

Add a **Shopify** node:
- Operation: Get Order
- Filter by customer email from the webhook
- Check if any order was created after the cart abandonment

### Step 4: IF node — still unpaid?

Add an **IF** node:
- Condition: Order status is NOT "paid"
- If true: continue to SMS
- If false: stop (customer already bought)

### Step 5: Find contact in inSIM

Add an **inSIM** node:
- Resource: **Contact**
- Operation: **Find by Phone**
- Phone Number: `{{ $json.customer.phone }}`

This finds the customer in your inSIM contacts by their phone number. If they exist, you get their full profile and ID for tagging.

### Step 6: Send recovery SMS

Add an **inSIM** node:
- Resource: **SMS**
- Operation: **Send**
- Phone Number: `{{ $json.customer.phone }}`
- Message:
  ```
  Hi {{ $json.customer.first_name }}! You left something in your cart at Belle Naturelle 🌿
  
  Your {{ $json.line_items[0].title }} is waiting for you — and here's 10% off to sweeten the deal: [link]
  
  Reply STOP to unsubscribe.
  ```
- URL (for tracking): `https://bellenaturelle.fr/cart/recover?token={{ $json.cart_token }}&discount=COMEBACK10`

The `[link]` placeholder is automatically replaced by a tracked short URL. Click tracking is available in inSIM stats.

### Step 7: Tag the contact

Add an **inSIM** node:
- Resource: **Contact**
- Operation: **Manage Tags**
- Contact ID: from Step 5 result
- Action: Add
- Tags: `abandoned-cart`, `recovery-sms-sent`

If the customer clicks the link (visible in inSIM stats), you can add a `hot-lead` tag in a follow-up workflow.

### Complete workflow JSON

You can import this workflow directly into n8n. Go to **Workflows** > **Import from URL** or paste the JSON.

> Full workflow JSON export coming soon — check back in `examples/workflows/`

## Results

| Metric | Email only | Email + SMS (inSIM) |
|--------|-----------|-------------------|
| Recovery message open rate | 12% | 45% (SMS) |
| Click-through rate | 3% | 18% |
| Cart recovery rate | 1.5% | 19.5% (+18pp) |
| Additional monthly revenue | €390 | €3,580 |
| Cost per SMS | N/A | €0 (existing mobile plan) |
| Customer reply rate | 0.5% (email) | 12% (real number) |

The biggest difference isn't just the open rate. It's that customers **reply** to the SMS. They text back "is this still available in blue?" or "can I change the size?" — and the support team responds from the same number. That's a conversation, not a broadcast.

### Why real numbers beat virtual numbers

| | Virtual number (Twilio) | Real number (inSIM) |
|--|------------------------|---------------------|
| Cost per SMS | €0.07 | €0 (mobile plan) |
| Customer pickup rate | ~15% | ~85% |
| Reply capability | Limited | Full conversation |
| Number recognition | Unknown sender | Already in contacts |
| Monthly cost (400 SMS) | €28 + platform fee | €0 |

## Variations

- [Event marketer: Post-trade-show follow-up](./event-post-tradeshow.md) *(coming soon)*
- [Agency marketer: Automated client reporting](./agency-client-reporting.md) *(coming soon)*
- [Franchise marketer: Multi-location campaigns](./franchise-multi-location.md) *(coming soon)*

## Related study cases

- [Real estate agent: Open house SMS follow-up](../../../insim-cli/docs/use-cases/real-estate-open-house.md) — CLI-based campaign after events
- [Support team: SMS-to-Slack routing](./sms-to-slack-support.md) — n8n workflow for incoming SMS handling
