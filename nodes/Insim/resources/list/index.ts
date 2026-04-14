import type { INodeProperties } from 'n8n-workflow';
import { filterEmptyParams } from '../../shared/preSend';

const show = { resource: ['list'] };

export const listDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show },
		options: [
			{
				name: 'Add All Contacts',
				value: 'addAll',
				action: 'Add all account contacts to a list',
				routing: {
					request: { method: 'POST', url: '/api/v2/lists/contacts/addall' },
					send: { preSend: [filterEmptyParams] },
				},
			},
			{
				name: 'Add Contacts',
				value: 'addContacts',
				action: 'Add contacts to a list',
				routing: {
					request: { method: 'POST', url: '/api/v2/lists/contacts/add' },
					send: { preSend: [filterEmptyParams] },
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a contact list',
				routing: {
					request: { method: 'POST', url: '/api/v2/lists/create' },
					send: { preSend: [filterEmptyParams] },
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a contact list',
				routing: {
					request: { method: 'POST', url: '/api/v2/lists/delete' },
					send: { preSend: [filterEmptyParams] },
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get list details and members',
				routing: {
					request: { method: 'POST', url: '/api/v2/lists/detail' },
					send: { preSend: [filterEmptyParams] },
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'List all contact lists',
				routing: {
					request: { method: 'POST', url: '/api/v2/lists' },
					send: { preSend: [filterEmptyParams] },
				},
			},
			{
				name: 'Remove Contacts',
				value: 'removeContacts',
				action: 'Remove contacts from a list',
				routing: {
					request: { method: 'POST', url: '/api/v2/lists/contacts/remove' },
					send: { preSend: [filterEmptyParams] },
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a contact list',
				routing: {
					request: { method: 'POST', url: '/api/v2/lists/update' },
					send: { preSend: [filterEmptyParams] },
				},
			},
		],
		default: 'getAll',
	},

	// ── List ID (shared) ──
	{
		displayName: 'List ID',
		name: 'list_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { ...show, operation: ['get', 'update', 'delete', 'addContacts', 'removeContacts', 'addAll'] } },
		routing: { send: { type: 'body', property: 'list_id' } },
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
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		displayOptions: { show: { ...show, operation: ['create'] } },
		routing: { send: { type: 'body', property: 'description' } },
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
		displayName: 'Description',
		name: 'updateDescription',
		type: 'string',
		default: '',
		displayOptions: { show: { ...show, operation: ['update'] } },
		routing: { send: { type: 'body', property: 'description' } },
	},

	// ── Add/Remove Contacts ──
	{
		displayName: 'Contact IDs',
		name: 'contact_ids',
		type: 'string',
		required: true,
		default: '',
		description: 'Comma-separated contact IDs',
		displayOptions: { show: { ...show, operation: ['addContacts', 'removeContacts'] } },
		routing: {
			send: {
				type: 'body',
				property: 'contact_ids',
				value: '={{ $value.split(",").map(id => id.trim()) }}',
			},
		},
	},
];
