import type { INodeProperties } from 'n8n-workflow';
import { filterEmptyParams, wrapContact } from '../../shared/preSend';

const show = { resource: ['contact'] };

export const contactDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show },
		options: [
			{
				name: 'Create/Update',
				value: 'create',
				action: 'Create or update a contact (upsert by phone)',
				routing: {
					request: { method: 'POST', url: '/api/v2/addcontacts' },
					send: { preSend: [wrapContact] },
				},
			},
			{
				name: 'Custom Fields',
				value: 'customFields',
				action: 'List custom fields',
				routing: {
					request: { method: 'POST', url: '/api/v2/contacts/custom_fields' },
					send: { preSend: [filterEmptyParams] },
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a contact',
				routing: {
					request: { method: 'POST', url: '/api/v2/contacts/delete' },
					send: { preSend: [filterEmptyParams] },
				},
			},
			{
				name: 'Find by Phone',
				value: 'find',
				action: 'Find contacts by phone number',
				routing: {
					request: { method: 'POST', url: '/api/v2/find_contact' },
					send: { preSend: [filterEmptyParams] },
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get contact details',
				routing: {
					request: { method: 'POST', url: '/api/v2/contacts/detail' },
					send: { preSend: [filterEmptyParams] },
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'List contacts',
				routing: {
					request: { method: 'POST', url: '/api/v2/contacts' },
					send: { preSend: [filterEmptyParams] },
				},
			},
			{
				name: 'Manage Tags',
				value: 'tags',
				action: 'Add or remove tags on a contact',
				routing: {
					request: { method: 'POST', url: '/api/v2/contacts/tags' },
					send: { preSend: [filterEmptyParams] },
				},
			},
			{
				name: 'Search',
				value: 'search',
				action: 'Search contacts by name',
				routing: {
					request: { method: 'POST', url: '/api/v2/contacts/search' },
					send: { preSend: [filterEmptyParams] },
				},
			},
			{
				name: 'Switch Pro/Perso',
				value: 'switchPro',
				action: 'Toggle contact Pro or Perso',
				routing: {
					request: { method: 'POST', url: '/api/v2/contacts/switch_pro' },
					send: { preSend: [filterEmptyParams] },
				},
			},
		],
		default: 'getAll',
	},

	// ── Find by Phone ──
	{
		displayName: 'Phone Number',
		name: 'phone_number',
		type: 'string',
		required: true,
		default: '',
		placeholder: '+33612345678',
		displayOptions: { show: { ...show, operation: ['find'] } },
		routing: { send: { type: 'body', property: 'phone_number' } },
	},

	// ── Get Many ──
	{
		displayName: 'Search',
		name: 'search',
		type: 'string',
		default: '',
		description: 'Filter by name, phone, email, or company',
		displayOptions: { show: { ...show, operation: ['getAll'] } },
		routing: { send: { type: 'body', property: 'search' } },
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
	{
		displayName: 'Cursor',
		name: 'cursor',
		type: 'string',
		default: '',
		description: 'Pagination cursor from previous response',
		displayOptions: { show: { ...show, operation: ['getAll'] } },
		routing: { send: { type: 'body', property: 'cursor' } },
	},

	// ── Get ──
	{
		displayName: 'Contact ID',
		name: 'id_contact',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { ...show, operation: ['get', 'delete', 'switchPro', 'tags'] } },
		routing: { send: { type: 'body', property: 'id_contact' } },
	},

	// ── Search ──
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { ...show, operation: ['search'] } },
		routing: { send: { type: 'body', property: 'name' } },
	},
	{
		displayName: 'Mode',
		name: 'mode',
		type: 'options',
		options: [
			{ name: 'Smart', value: 'smart' },
			{ name: 'Exact', value: 'exact' },
			{ name: 'Starts With', value: 'starts_with' },
		],
		default: 'smart',
		displayOptions: { show: { ...show, operation: ['search'] } },
		routing: { send: { type: 'body', property: 'mode' } },
	},
	{
		displayName: 'Fuzzy',
		name: 'fuzzy',
		type: 'boolean',
		default: true,
		description: 'Whether to enable typo tolerance',
		displayOptions: { show: { ...show, operation: ['search'] } },
		routing: { send: { type: 'body', property: 'fuzzy' } },
	},
	{
		displayName: 'Limit',
		name: 'searchLimit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 20,
		displayOptions: { show: { ...show, operation: ['search'] } },
		routing: { send: { type: 'body', property: 'limit' } },
	},

	// ── Create/Update (addcontacts) ──
	{
		displayName: 'Phone Number',
		name: 'phone_number',
		type: 'string',
		required: true,
		default: '',
		placeholder: '+33612345678',
		displayOptions: { show: { ...show, operation: ['create'] } },
		routing: { send: { type: 'body', property: 'phone_number' } },
	},
	{
		displayName: 'First Name',
		name: 'firstname',
		type: 'string',
		default: '',
		displayOptions: { show: { ...show, operation: ['create'] } },
		routing: { send: { type: 'body', property: 'firstname' } },
	},
	{
		displayName: 'Last Name',
		name: 'lastname',
		type: 'string',
		default: '',
		displayOptions: { show: { ...show, operation: ['create'] } },
		routing: { send: { type: 'body', property: 'lastname' } },
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		default: '',
		placeholder: 'name@example.com',
		displayOptions: { show: { ...show, operation: ['create'] } },
		routing: { send: { type: 'body', property: 'email' } },
	},
	{
		displayName: 'Address',
		name: 'address',
		type: 'string',
		default: '',
		displayOptions: { show: { ...show, operation: ['create'] } },
		routing: { send: { type: 'body', property: 'address' } },
	},

	// ── Switch Pro ──
	{
		displayName: 'Pro',
		name: 'pro',
		type: 'boolean',
		default: true,
		description: 'Whether to set the contact as Pro (shared with team)',
		displayOptions: { show: { ...show, operation: ['switchPro'] } },
		routing: { send: { type: 'body', property: 'pro' } },
	},

	// ── Tags ──
	{
		displayName: 'Tags to Add',
		name: 'add',
		type: 'string',
		default: '',
		description: 'Comma-separated tags to add',
		displayOptions: { show: { ...show, operation: ['tags'] } },
		routing: {
			send: {
				type: 'body',
				property: 'add',
				value: '={{ $value ? $value.split(",").map(t => t.trim()) : [] }}',
			},
		},
	},
	{
		displayName: 'Tags to Remove',
		name: 'remove',
		type: 'string',
		default: '',
		description: 'Comma-separated tags to remove',
		displayOptions: { show: { ...show, operation: ['tags'] } },
		routing: {
			send: {
				type: 'body',
				property: 'remove',
				value: '={{ $value ? $value.split(",").map(t => t.trim()) : [] }}',
			},
		},
	},
];
