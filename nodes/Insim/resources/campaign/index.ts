import type { INodeProperties } from 'n8n-workflow';
import { filterEmptyParams } from '../../shared/preSend';

const show = { resource: ['campaign'] };

export const campaignDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show },
		options: [
			{
				name: 'Cancel',
				value: 'cancel',
				action: 'Cancel a campaign',
				routing: {
					request: { method: 'POST', url: '/api/v2/campaigns/cancel' },
					send: { preSend: [filterEmptyParams] },
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create an SMS campaign',
				routing: {
					request: { method: 'POST', url: '/api/v2/campaigns/create' },
					send: { preSend: [filterEmptyParams] },
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get campaign details',
				routing: {
					request: { method: 'POST', url: '/api/v2/campaigns/detail' },
					send: { preSend: [filterEmptyParams] },
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'List campaigns',
				routing: {
					request: { method: 'POST', url: '/api/v2/campaigns' },
					send: { preSend: [filterEmptyParams] },
				},
			},
			{
				name: 'Start',
				value: 'start',
				action: 'Launch a campaign (Premium)',
				routing: {
					request: { method: 'POST', url: '/api/v2/campaigns/start' },
					send: { preSend: [filterEmptyParams] },
				},
			},
		],
		default: 'getAll',
	},

	// ── Campaign ID (shared) ──
	{
		displayName: 'Campaign ID',
		name: 'campaign_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { ...show, operation: ['get', 'cancel', 'start'] } },
		routing: { send: { type: 'body', property: 'campaign_id' } },
	},

	// ── Get Many ──
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 10,
		displayOptions: { show: { ...show, operation: ['getAll'] } },
		routing: { send: { type: 'body', property: 'limit' } },
	},

	// ── Create ──
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { ...show, operation: ['create'] } },
		routing: { send: { type: 'body', property: 'name' } },
	},
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		typeOptions: { rows: 3 },
		required: true,
		default: '',
		description: 'SMS body. Use [link] for tracked URL.',
		displayOptions: { show: { ...show, operation: ['create'] } },
		routing: { send: { type: 'body', property: 'message' } },
	},
	{
		displayName: 'List ID',
		name: 'list_id',
		type: 'string',
		default: '',
		description: 'Target list ID (for recipients from a list)',
		displayOptions: { show: { ...show, operation: ['create'] } },
		routing: { send: { type: 'body', property: 'list_id' } },
	},
	{
		displayName: 'Contact IDs',
		name: 'contact_ids',
		type: 'string',
		default: '',
		description: 'Comma-separated contact IDs as recipients',
		displayOptions: { show: { ...show, operation: ['create'] } },
		routing: {
			send: {
				type: 'body',
				property: 'contact_ids',
				value: '={{ $value ? $value.split(",").map(id => id.trim()) : [] }}',
			},
		},
	},
	{
		displayName: 'Phone Numbers',
		name: 'phone_numbers',
		type: 'string',
		default: '',
		description: 'Comma-separated phone numbers as recipients',
		displayOptions: { show: { ...show, operation: ['create'] } },
		routing: {
			send: {
				type: 'body',
				property: 'phone_numbers',
				value: '={{ $value ? $value.split(",").map(p => p.trim()) : [] }}',
			},
		},
	},
	{
		displayName: 'Priority',
		name: 'priority',
		type: 'number',
		default: 1,
		displayOptions: { show: { ...show, operation: ['create'] } },
		routing: { send: { type: 'body', property: 'priority' } },
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		default: '',
		description: 'URL to track (used with [link] in message)',
		displayOptions: { show: { ...show, operation: ['create'] } },
		routing: { send: { type: 'body', property: 'url' } },
	},
];
