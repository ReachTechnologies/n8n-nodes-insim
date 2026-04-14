import type { INodeProperties } from 'n8n-workflow';
import { filterEmptyParams } from '../../shared/preSend';

const show = { resource: ['account'] };

export const accountDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show },
		options: [
			{
				name: 'Info',
				value: 'info',
				action: 'Get account information',
				routing: {
					request: { method: 'POST', url: '/api/v2/account' },
					send: { preSend: [filterEmptyParams] },
				},
			},
			{
				name: 'Webhooks',
				value: 'webhooks',
				action: 'Read or configure webhooks (Premium)',
				routing: {
					request: { method: 'POST', url: '/api/v2/account/webhooks' },
					send: { preSend: [filterEmptyParams] },
				},
			},
		],
		default: 'info',
	},

	// ── Webhooks ──
	{
		displayName: 'Action',
		name: 'action',
		type: 'options',
		options: [
			{ name: 'Read Current', value: 'get' },
			{ name: 'Set Webhooks', value: 'set' },
		],
		default: 'get',
		displayOptions: { show: { ...show, operation: ['webhooks'] } },
		routing: { send: { type: 'body', property: 'action' } },
	},
	{
		displayName: 'Incoming SMS URL',
		name: 'incoming_sms',
		type: 'string',
		default: '',
		displayOptions: { show: { ...show, operation: ['webhooks'], action: ['set'] } },
		routing: { send: { type: 'body', property: 'webhooks.incoming_sms' } },
	},
	{
		displayName: 'Delivery Status URL',
		name: 'delivery_status',
		type: 'string',
		default: '',
		displayOptions: { show: { ...show, operation: ['webhooks'], action: ['set'] } },
		routing: { send: { type: 'body', property: 'webhooks.delivery_status' } },
	},
	{
		displayName: 'Link Clicks URL',
		name: 'link_clicks',
		type: 'string',
		default: '',
		displayOptions: { show: { ...show, operation: ['webhooks'], action: ['set'] } },
		routing: { send: { type: 'body', property: 'webhooks.link_clicks' } },
	},
	{
		displayName: 'Call Events URL',
		name: 'call_events',
		type: 'string',
		default: '',
		displayOptions: { show: { ...show, operation: ['webhooks'], action: ['set'] } },
		routing: { send: { type: 'body', property: 'webhooks.call_events' } },
	},
	{
		displayName: 'Call Qualifications URL',
		name: 'call_qualifications',
		type: 'string',
		default: '',
		displayOptions: { show: { ...show, operation: ['webhooks'], action: ['set'] } },
		routing: { send: { type: 'body', property: 'webhooks.call_qualifications' } },
	},
];
