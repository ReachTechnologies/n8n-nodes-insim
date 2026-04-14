import type { INodeProperties } from 'n8n-workflow';
import { filterEmptyParams, wrapTemplateRecipient } from '../../shared/preSend';

const show = { resource: ['template'] };

export const templateDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a message template',
				routing: {
					request: { method: 'POST', url: '/api/v2/templates/create' },
					send: { preSend: [filterEmptyParams] },
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a message template',
				routing: {
					request: { method: 'POST', url: '/api/v2/templates/delete' },
					send: { preSend: [filterEmptyParams] },
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'List message templates',
				routing: {
					request: { method: 'POST', url: '/api/v2/templates' },
					send: { preSend: [filterEmptyParams] },
				},
			},
			{
				name: 'Send',
				value: 'send',
				action: 'Send a template to a recipient (Premium)',
				routing: {
					request: { method: 'POST', url: '/api/v2/templates/send' },
					send: { preSend: [wrapTemplateRecipient] },
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a message template',
				routing: {
					request: { method: 'POST', url: '/api/v2/templates/update' },
					send: { preSend: [filterEmptyParams] },
				},
			},
		],
		default: 'getAll',
	},

	// ── Template ID (shared) ──
	{
		displayName: 'Template ID',
		name: 'template_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { ...show, operation: ['update', 'delete', 'send'] } },
		routing: { send: { type: 'body', property: 'template_id' } },
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
		description: 'Template body. Variables: {firstname}, {lastname}, {email}, {phone_number}, {custom.X}',
		displayOptions: { show: { ...show, operation: ['create'] } },
		routing: { send: { type: 'body', property: 'message' } },
	},

	// ── Update ──
	{
		displayName: 'Name',
		name: 'updateName',
		type: 'string',
		default: '',
		displayOptions: { show: { ...show, operation: ['update'] } },
		routing: { send: { type: 'body', property: 'name' } },
	},
	{
		displayName: 'Message',
		name: 'updateMessage',
		type: 'string',
		typeOptions: { rows: 3 },
		default: '',
		displayOptions: { show: { ...show, operation: ['update'] } },
		routing: { send: { type: 'body', property: 'message' } },
	},

	// ── Send ──
	{
		displayName: 'Phone Number',
		name: 'phone_number',
		type: 'string',
		required: true,
		default: '',
		placeholder: '+33612345678',
		displayOptions: { show: { ...show, operation: ['send'] } },
		routing: { send: { type: 'body', property: 'phone_number' } },
	},
	{
		displayName: 'Variables (JSON)',
		name: 'variables',
		type: 'string',
		default: '',
		placeholder: '{"firstname": "Marie", "custom.date": "15/04"}',
		description: 'Template variables as JSON string',
		displayOptions: { show: { ...show, operation: ['send'] } },
		routing: { send: { type: 'body', property: 'variables' } },
	},
];
