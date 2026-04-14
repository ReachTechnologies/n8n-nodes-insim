# Example Workflows

Ready-to-import n8n workflow templates using the inSIM community node.

## How to import

1. Open your n8n instance
2. Go to **Workflows** > **Import from file**
3. Select the `.json` file
4. Update the inSIM credentials in the workflow

## Available workflows

| Workflow | File | Description |
|----------|------|-------------|
| Incoming SMS to Slack | `incoming-sms-to-slack.json` | Route incoming SMS to a Slack channel with contact info |
| Abandoned Cart SMS | `shopify-abandoned-cart.json` | Shopify cart abandoned → wait 1h → send recovery SMS |
| Weekly Report | `weekly-campaign-report.json` | Weekly SMS stats summary sent to email |

## Prerequisites

- n8n instance with `n8n-nodes-insim` installed
- inSIM API credentials configured in n8n
- Relevant third-party credentials (Shopify, Slack, etc.)
