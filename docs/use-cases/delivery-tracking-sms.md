# "Customers call 20 times a day to ask 'Where is my package?'"

> **Persona**: Youssef, logistics coordinator at an e-commerce fulfillment center — Lille, France — 15 employees
> **Tool**: n8n + n8n-nodes-insim + WooCommerce
> **Setup time**: 1.5 hours
> **ROI estimate**: 75% reduction in "where is my package" calls, CSAT from 3.1 to 4.5/5

## The problem

Youssef runs logistics for NordExpress, a fulfillment center that ships 200 packages per day for 6 e-commerce brands. Customers want to know where their package is — and they want to know now.

The current tracking experience: an email with a Colissimo tracking number that links to La Poste's tracking page. The problem is threefold. First, the email often lands in spam or promotions. Second, customers have to click through to a third-party site and enter their tracking number. Third, when they can't figure it out, they call — and NordExpress handles 40-60 "where is my package" calls per day. That's one full-time person doing nothing but answering the same question.

Youssef has tried more detailed email notifications. Open rates barely moved. The customers who call are the ones who don't check email — but they check every text message within 3 minutes. He needs proactive SMS updates at each stage: picked, shipped, out for delivery, delivered. From a real number that customers can text back if something goes wrong.

## The solution with inSIM

1. **Webhook** — WooCommerce fires a webhook when order status changes (processing, shipped, out-for-delivery, completed).
2. **Map** — n8n maps the order status to the right SMS template.
3. **Send** — n8n sends a status SMS via inSIM with tracking details.
4. **Handle replies** — If a customer texts back with a question, n8n routes it to the support team via Slack.

## Workflow overview

**Outbound (status updates):**
```
[WooCommerce Webhook: order status changed] → [Function: Map status to template]
    → [inSIM: Find by Phone] → [inSIM: Send SMS] → [inSIM: Manage Tags → "tracking-{{status}}"]
```

**Inbound (customer replies):**
```
[Webhook: SMS received] → [inSIM: Find by Phone] → [inSIM: SMS > Get Conversation]
    → [Slack: Post to #delivery-support]
```

## Key n8n nodes used

| Node | Purpose |
|------|---------|
| **Webhook** | Receives WooCommerce order status changes |
| **Function** | Maps order status to the correct SMS template |
| **inSIM: Contact > Find by Phone** | Looks up customer by phone number |
| **inSIM: SMS > Send** | Sends tracking SMS at each stage |
| **inSIM: Contact > Manage Tags** | Tags contact with delivery stage |
| **inSIM: SMS > Get Conversation** | Retrieves thread context for support replies |
| **Slack** | Routes customer questions to the delivery support channel |

## SMS templates by status

**Picked (order confirmed):**
```
NordExpress: Votre commande #{{ order_id }} est preparee!
Expedition prevue demain. Vous recevrez un SMS avec le suivi.
```

**Shipped:**
```
Votre colis #{{ order_id }} est en route!
Suivi Colissimo: {{ tracking_number }}
Livraison estimee: {{ estimated_date }}
Repondez a ce SMS pour toute question.
```

**Out for delivery:**
```
Votre colis #{{ order_id }} est en cours de livraison aujourd'hui!
Le livreur passera entre {{ time_slot }}.
Repondez si vous avez des instructions de livraison.
```

**Delivered:**
```
Votre colis #{{ order_id }} a ete livre!
Un souci? Repondez directement a ce SMS, on s'en occupe.
```

## Status-to-template mapping

| WooCommerce Status | SMS Template | Tag Applied |
|-------------------|-------------|-------------|
| `processing` | Picked | `tracking-picked` |
| `shipped` | Shipped | `tracking-shipped` |
| `out-for-delivery` | Out for delivery | `tracking-out` |
| `completed` | Delivered | `tracking-delivered` |

## Results

| Metric | Before (email only) | After (SMS via inSIM) |
|--------|--------------------|-----------------------|
| "Where is my package" calls per day | 40-60 | 8-12 |
| Tracking email open rate | 35% | N/A (SMS: 97% read rate) |
| Customer satisfaction (CSAT) | 3.1/5 | 4.5/5 |
| Support staff time on tracking questions | 6 hours/day | 1.5 hours/day |
| Customer replies with delivery instructions | 0 (email) | 15% (SMS) |

The unexpected win: 15% of customers reply to the "out for delivery" SMS with instructions — "leave at the back door" or "neighbor at #4 can receive it." These replies go straight to the delivery team via Slack, reducing failed deliveries by 30%.

## Related study cases

- [Support team: SMS-to-Slack routing](./sms-to-slack-support.md) — parent study case (inbound SMS handling via n8n)
- [After-sales: Satisfaction survey via SMS](./satisfaction-survey-sms.md) — post-delivery feedback collection
- [Shopify: Abandoned cart SMS recovery](./shopify-abandoned-cart.md) — outbound SMS automation with e-commerce triggers
