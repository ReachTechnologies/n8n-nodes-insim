import type { INodeProperties } from 'n8n-workflow';
import { filterEmptyParams } from '../../shared/preSend';

const show = { resource: ['call'] };

export const callDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show },
		options: [
			{
				name: 'Click to Call',
				value: 'clickToCall',
				action: 'Initiate a call via inSIM device (Premium)',
				routing: {
					request: { method: 'POST', url: '/api/v2/clictocall' },
					send: { preSend: [filterEmptyParams] },
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'List calls',
				routing: {
					request: { method: 'POST', url: '/api/v2/calls' },
					send: { preSend: [filterEmptyParams] },
				},
			},
			{
				name: 'Qualify',
				value: 'qualify',
				action: 'Qualify a call',
				routing: {
					request: { method: 'POST', url: '/api/v2/calls/qualify' },
					send: { preSend: [filterEmptyParams] },
				},
			},
		],
		default: 'getAll',
	},

	// ── Get Many ──
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: [
			{ name: 'All', value: 'all' },
			{ name: 'Incoming', value: 'incoming' },
			{ name: 'Outgoing', value: 'outgoing' },
			{ name: 'Missed', value: 'missed' },
			{ name: 'Blocked', value: 'blocked' },
			{ name: 'Voicemail', value: 'voicemail' },
		],
		default: 'all',
		displayOptions: { show: { ...show, operation: ['getAll'] } },
		routing: { send: { type: 'body', property: 'type' } },
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
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 50,
		displayOptions: { show: { ...show, operation: ['getAll'] } },
		routing: { send: { type: 'body', property: 'limit' } },
	},

	// ── Qualify ──
	{
		displayName: 'Call ID',
		name: 'call_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { ...show, operation: ['qualify'] } },
		routing: { send: { type: 'body', property: 'call_id' } },
	},
	{
		displayName: 'Option ID',
		name: 'option_id',
		type: 'string',
		required: true,
		default: '',
		description: 'Qualification option ID (from Qualification > Get Options)',
		displayOptions: { show: { ...show, operation: ['qualify'] } },
		routing: { send: { type: 'body', property: 'option_id' } },
	},
	{
		displayName: 'Notes',
		name: 'notes',
		type: 'string',
		default: '',
		displayOptions: { show: { ...show, operation: ['qualify'] } },
		routing: { send: { type: 'body', property: 'notes' } },
	},

	// ── Click to Call ──
	{
		displayName: 'Phone Number',
		name: 'clickPhone',
		type: 'string',
		required: true,
		default: '',
		placeholder: '+33612345678',
		displayOptions: { show: { ...show, operation: ['clickToCall'] } },
		routing: { send: { type: 'body', property: 'phone_number' } },
	},
];
