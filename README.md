# n8n-nodes-insim

> **Automate mobile telephony without code.**
> SMS campaigns, lead follow-ups, appointment reminders — all from your real mobile number.

[![npm version](https://img.shields.io/npm/v/n8n-nodes-insim.svg)](https://www.npmjs.com/package/n8n-nodes-insim)
[![n8n compatible](https://img.shields.io/badge/n8n-community_node-ff6d5a.svg)](https://docs.n8n.io/integrations/community-nodes/)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## The problem

You automate everything with n8n — emails, Slack, CRM updates, database syncs. But when it comes to SMS, you're stuck with expensive providers and virtual numbers that customers ignore.

Your real mobile number gets answers. Virtual short codes don't.

## The solution

`n8n-nodes-insim` connects your n8n workflows to your real mobile phone. Send SMS, manage contacts, run campaigns, qualify calls — triggered by any of n8n's 400+ integrations. Cost: your existing mobile plan. Zero per-message fees.

## Install

1. Open your n8n instance
2. Go to **Settings** > **Community Nodes**
3. Enter `n8n-nodes-insim`
4. Click **Install**

That's it. The inSIM node appears in your node palette.

## Credentials

1. In n8n, go to **Credentials** > **Add Credential**
2. Search for **inSIM API**
3. Enter:
   - **Login**: Your inSIM account email
   - **Access Key**: Your API access key (from [insim.app](https://www.insim.app) > Settings > API)

## Available operations

### Contact

| Operation | Description |
|-----------|-------------|
| List | List contacts with search, pagination, sorting |
| Get | Get full contact details by ID |
| Search | Smart search by name (handles typos, inversions) |
| Create/Update | Create a new contact or update existing |
| Delete | Delete a contact |
| Manage Tags | Add or remove tags on a contact |

### SMS

| Operation | Description |
|-----------|-------------|
| List | List SMS with filters (direction, phone, date) |
| Get Detail | Full SMS details with click tracking |
| Get Conversation | Conversation thread with a phone number |
| Check Delivery | Check SMS delivery status |
| Send | Send an SMS to a phone number |

### Call

| Operation | Description |
|-----------|-------------|
| List | Call log with type and phone filters |
| Qualify | Qualify a call with category and notes |
| Click-to-Call | Initiate a call via connected device |

### Campaign

| Operation | Description |
|-----------|-------------|
| List | List all campaigns |
| Create | Create an SMS campaign |
| Get Detail | Campaign details and stats |
| Start | Launch a campaign (sends real SMS) |
| Cancel | Cancel a pending campaign |

### Template

| Operation | Description |
|-----------|-------------|
| List | List message templates |
| Create | Create a template with variables |
| Update | Update template content |
| Delete | Delete a template |
| Send | Send SMS using a template |

### List (Contact Lists)

| Operation | Description |
|-----------|-------------|
| List | List all contact lists |
| Create | Create a new list |
| Get Detail | List details with contacts |
| Update | Rename a list |
| Delete | Delete a list |
| Add Contacts | Add contacts to a list |
| Remove Contacts | Remove contacts from a list |

### Qualification

| Operation | Description |
|-----------|-------------|
| List | List qualified calls |
| Get Options | List qualification categories |
| Create Option | Create a category |
| Update Option | Rename a category |
| Delete Option | Delete a category |
| Stats | Qualification statistics |

### Stats

| Operation | Description |
|-----------|-------------|
| Overview | SMS, calls, clicks, contacts summary |
| Clicks | Link click tracking details |

### Account

| Operation | Description |
|-----------|-------------|
| Get Info | Account details, credits, connected devices |
| Configure Webhooks | Set webhook URLs for SMS, calls, delivery |

## Example workflows

### Shopify abandoned cart SMS

Trigger on abandoned cart > Wait 1 hour > Send SMS with discount code via inSIM

### Calendly appointment reminder

Trigger on new booking > Schedule SMS 24h before > Send reminder via inSIM

### Incoming SMS to Slack

Webhook trigger on inSIM SMS received > Format message > Post to Slack channel

> Workflow JSON exports coming soon in [`docs/use-cases/`](./docs/use-cases/)

## What you can automate

- **E-commerce**: order confirmations, shipping updates, abandoned cart recovery
- **Appointments**: reminders, confirmations, rescheduling
- **Lead follow-up**: auto-SMS after form submission, missed call follow-up
- **Support**: route incoming SMS to Slack/email, auto-acknowledge
- **Campaigns**: scheduled bulk SMS, A/B testing, drip sequences
- **CRM sync**: tag contacts, update lists, sync with external CRMs

## Requirements

- n8n (self-hosted or cloud)
- An inSIM account with API access
- The [inSIM Android app](https://play.google.com/store/apps/details?id=com.wstechnologies.ardarysolo) installed on your phone

## Study cases

- [E-commerce: Abandoned cart SMS recovery](./docs/use-cases/) *(coming soon)*
- [Real estate: Open house follow-up](./docs/use-cases/) *(coming soon)*
- [Support: SMS to Slack routing](./docs/use-cases/) *(coming soon)*

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and guidelines.

## License

Apache 2.0 — see [LICENSE](./LICENSE).

---

Built by [Reach Technologies](https://www.insim.app) — the company behind inSIM.
