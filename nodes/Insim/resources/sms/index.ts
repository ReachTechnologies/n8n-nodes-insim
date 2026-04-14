import type { INodeProperties } from 'n8n-workflow';
import { filterEmptyParams, wrapSmsMessage } from '../../shared/preSend';

const show = { resource: ['sms'] };

export const smsDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show },
		options: [
			{
				name: 'Conversation',
				value: 'conversation',
				action: 'Get SMS conversation with a phone number',
				routing: {
					request: { method: 'POST', url: '/api/v2/sms/conversation' },
					send: { preSend: [filterEmptyParams] },
				},
			},
			{
				name: 'Delivery Status',
				value: 'deliveryStatus',
				action: 'Check SMS delivery status',
				routing: {
					request: { method: 'POST', url: '/api/v2/sms/delivery_status' },
					send: { preSend: [filterEmptyParams] },
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get SMS details',
				routing: {
					request: { method: 'POST', url: '/api/v2/sms/detail' },
					send: { preSend: [filterEmptyParams] },
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'List SMS messages',
				routing: {
					request: { method: 'POST', url: '/api/v2/sms' },
					send: { preSend: [filterEmptyParams] },
				},
			},
			{
				name: 'Send',
				value: 'send',
				action: 'Send an SMS (Premium)',
				routing: {
					request: { method: 'POST', url: '/api/v2/sendsms' },
					send: { preSend: [wrapSmsMessage] },
				},
			},
		],
		default: 'getAll',
	},

	// ── Get Many ──
	{
		displayName: 'Direction',
		name: 'direction',
		type: 'options',
		options: [
			{ name: 'All', value: 'all' },
			{ name: 'Inbound', value: 'inbound' },
			{ name: 'Outbound', value: 'outbound' },
		],
		default: 'all',
		displayOptions: { show: { ...show, operation: ['getAll'] } },
		routing: { send: { type: 'body', property: 'direction' } },
	},
	{
		displayName: 'Phone Number',
		name: 'phone_number',
		type: 'string',
		default: '',
		displayOptions: { show: { ...show, operation: ['getAll'] } },
		routing: { send: { type: 'body', property: 'phone_number' } },
	},
	{
		displayName: 'Date From',
		name: 'date_from',
		type: 'string',
		default: '',
		placeholder: '2026-01-01',
		displayOptions: { show: { ...show, operation: ['getAll'] } },
		routing: { send: { type: 'body', property: 'date_from' } },
	},
	{
		displayName: 'Date To',
		name: 'date_to',
		type: 'string',
		default: '',
		placeholder: '2026-12-31',
		displayOptions: { show: { ...show, operation: ['getAll'] } },
		routing: { send: { type: 'body', property: 'date_to' } },
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 50,
		displayOptions: { show: { ...show, operation: ['getAll'] } },
		routing: { send: { type: 'body', property: 'limit' } },
	},

	// ── Get ──
	{
		displayName: 'SMS ID',
		name: 'sms_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { ...show, operation: ['get', 'deliveryStatus'] } },
		routing: { send: { type: 'body', property: 'sms_id' } },
	},

	// ── Conversation ──
	{
		displayName: 'Phone Number',
		name: 'conversationPhone',
		type: 'string',
		required: true,
		default: '',
		placeholder: '+33612345678',
		displayOptions: { show: { ...show, operation: ['conversation'] } },
		routing: { send: { type: 'body', property: 'phone_number' } },
	},
	{
		displayName: 'Limit',
		name: 'conversationLimit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 20,
		displayOptions: { show: { ...show, operation: ['conversation'] } },
		routing: { send: { type: 'body', property: 'limit' } },
	},

	// ── Send ──
	{
		displayName: 'Phone Number',
		name: 'sendPhone',
		type: 'string',
		required: true,
		default: '',
		placeholder: '+33612345678',
		displayOptions: { show: { ...show, operation: ['send'] } },
		routing: { send: { type: 'body', property: 'phone_number' } },
	},
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		typeOptions: { rows: 3 },
		required: true,
		default: '',
		description: 'SMS body. Use [link] for tracked URL.',
		displayOptions: { show: { ...show, operation: ['send'] } },
		routing: { send: { type: 'body', property: 'message' } },
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		default: '',
		description: 'URL to track (used with [link] in message)',
		displayOptions: { show: { ...show, operation: ['send'] } },
		routing: { send: { type: 'body', property: 'url' } },
	},
	{
		displayName: 'Priority',
		name: 'priority',
		type: 'number',
		default: 1,
		displayOptions: { show: { ...show, operation: ['send'] } },
		routing: { send: { type: 'body', property: 'priority' } },
	},
];
