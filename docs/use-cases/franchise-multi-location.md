# "8 bakeries, 1 marketing team. Every location wants its own promotions."

> **Persona**: Antoine, marketing director at a bakery franchise — Marseille, France — 8 locations, 45 employees
> **Tool**: n8n + n8n-nodes-insim
> **Setup time**: 1.5 hours
> **ROI estimate**: 3x promo redemption rate, 6 hours/week saved on campaign coordination

## The problem

Antoine oversees marketing for Maison Dorée, a bakery franchise with 8 locations across the Bouches-du-Rhône region. Each location serves a different neighborhood with different customer profiles: the Vieux-Port store has tourists, the Aix location has students, the Aubagne store has families.

When headquarters runs a promotion — say, "20% off croissants this Saturday" — it goes to everyone. But the Aix store is overstocked on pain au chocolat, not croissants. The Aubagne store wants to push their new gluten-free bread. The Vieux-Port store needs to promote the lunch formula for the tourist season.

Antoine tried creating separate SMS campaigns for each store manually. It takes 6 hours per week: export the right contact segment, write the message, schedule the send, repeat 8 times. He's looked at marketing automation platforms, but they all require virtual numbers — and customers trust the bakery's real phone number. They text it to ask about opening hours or place special orders.

He needs one workflow that sends location-specific promotions to the right customers, from the store's real number.

## The solution with inSIM

1. **Segment** — Each customer in inSIM is tagged with their home store (e.g., `store:vieux-port`, `store:aix`).
2. **Configure** — A Google Sheet holds each store's weekly promotion: message, offer, and any custom link.
3. **Run** — Every Thursday at 10am, n8n reads the promo sheet, fetches contacts by store tag, and sends location-specific SMS.
4. **Track** — Each send is tagged in inSIM for redemption tracking and click stats.

## Workflow overview

```
[Schedule Trigger: Thu 10am] → [Google Sheets: Get promo rows] → [Loop: each store]
    → [inSIM: Get Many contacts (filtered by store tag)]
        → [Loop: each contact]
            → [inSIM: Send SMS (store-specific promo)]
            → [inSIM: Manage Tags → "promo-{{week}}-sent"]
```

**Optional redemption tracking:**
```
[Webhook: SMS reply "OUI"] → [inSIM: Find by Phone] → [inSIM: Manage Tags → "promo-redeemed"]
    → [Google Sheets: Increment redemption count]
```

## Key n8n nodes used

| Node | Purpose |
|------|---------|
| **Schedule Trigger** | Fires every Thursday at 10am |
| **Google Sheets** | Reads per-store promo details (message, link, store name) |
| **Loop Over Items** | Iterates through stores, then contacts per store |
| **inSIM: Contact > Get Many** | Fetches contacts filtered by store tag |
| **inSIM: SMS > Send** | Sends the location-specific SMS |
| **inSIM: Contact > Manage Tags** | Tags contacts with promo-sent and promo-redeemed |
| **inSIM: Contact > Find by Phone** | Looks up contacts replying "OUI" to redeem |
| **inSIM: Stats > Clicks** | Tracks link clicks per store promo |

## Google Sheets promo configuration

| Store | Tag | Message | Link | Active |
|-------|-----|---------|------|--------|
| Vieux-Port | store:vieux-port | Formule dejeuner 8.90 EUR ce samedi! Sandwich + boisson + patisserie. Montrez ce SMS en caisse. | https://maisondoree.fr/vp-lunch | Yes |
| Aix | store:aix | -30% pain au chocolat jusqu'a dimanche! Passez avant 10h. Repondez OUI pour reserver. | https://maisondoree.fr/aix-pdc | Yes |
| Aubagne | store:aubagne | Nouveau: pain sans gluten! Venez gouter gratuitement samedi matin. [link] | https://maisondoree.fr/aubagne-gf | Yes |

## SMS examples

**Vieux-Port (tourists + lunch crowd):**
```
Maison Doree Vieux-Port: Formule dejeuner 8.90 EUR ce samedi!
Sandwich + boisson + patisserie. Montrez ce SMS en caisse.
STOP pour se desinscrire.
```

**Aix (students):**
```
Maison Doree Aix: -30% pain au chocolat jusqu'a dimanche!
Passez avant 10h pour en profiter. Repondez OUI pour reserver.
STOP pour se desinscrire.
```

## Results

| Metric | Before (generic blast) | After (per-store SMS) |
|--------|----------------------|----------------------|
| Promo redemption rate | 4% | 14% |
| Campaign prep time per week | 6 hours | 15 min (update Google Sheet) |
| Customer opt-out rate | 8% per quarter | 1.5% per quarter |
| Average basket increase on promo day | +5% | +22% |
| Stores reporting "wrong promo" complaints | 3-4/month | 0 |

The biggest win: relevance. When a student in Aix gets a deal on pain au chocolat instead of a tourist lunch formula, they actually show up. And because the SMS comes from the store's real number, customers reply — "Can I reserve 10 for a study group?" — creating real conversations that drive extra sales.

## Related study cases

- [Shopify: Abandoned cart SMS recovery](./shopify-abandoned-cart.md) — parent study case (automated SMS campaigns via n8n)
- [Event marketer: Post-trade-show follow-up](./event-post-tradeshow.md) — SMS drip sequences with tags
- [Agency: Automated client reporting by SMS](./agency-client-reporting.md) — scheduled SMS from Google Sheets data
