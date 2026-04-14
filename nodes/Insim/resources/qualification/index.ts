import type { INodeProperties } from 'n8n-workflow';
import { filterEmptyParams } from '../../shared/preSend';

const show = { resource: ['qualification'] };

export const qualificationDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show },
		options: [
			{
				name: 'Create Option',
				value: 'createOption',
				action: 'Create a qualification option',
				routing: {
					request: { method: 'POST', url: '/api/v2/qualifications/options/create' },
					send: { preSend: [filterEmptyParams] },
				},
			},
			{
				name: 'Delete Option',
				value: 'deleteOption',
				action: 'Delete a qualification option',
				routing: {
					request: { method: 'POST', url: '/api/v2/qualifications/options/delete' },
					send: { preSend: [filterEmptyParams] },
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'List qualified calls',
				routing: {
					request: { method: 'POST', url: '/api/v2/qualifications' },
					send: { preSend: [filterEmptyParams] },
				},
			},
			{
				name: 'Get Options',
				value: 'getOptions',
				action: 'List qualification options',
				routing: {
					request: { method: 'POST', url: '/api/v2/qualifications/options' },
					send: { preSend: [filterEmptyParams] },
				},
			},
			{
				name: 'Stats',
				value: 'stats',
				action: 'Get qualification statistics',
				routing: {
					request: { method: 'POST', url: '/api/v2/qualifications/stats' },
					send: { preSend: [filterEmptyParams] },
				},
			},
			{
				name: 'Update Option',
				value: 'updateOption',
				action: 'Update a qualification option',
				routing: {
					request: { method: 'POST', url: '/api/v2/qualifications/options/update' },
					send: { preSend: [filterEmptyParams] },
				},
			},
		],
		default: 'getAll',
	},

	// ── Get Many ──
	{
		displayName: 'Phone Number',
		name: 'phone_number',
		type: 'string',
		default: '',
		displayOptions: { show: { ...show, operation: ['getAll'] } },
		routing: { send: { type: 'body', property: 'phone_number' } },
	},
	{
		displayName: 'Option ID',
		name: 'filterOptionId',
		type: 'string',
		default: '',
		displayOptions: { show: { ...show, operation: ['getAll'] } },
		routing: { send: { type: 'body', property: 'option_id' } },
	},
	{
		displayName: 'Date From',
		name: 'date_from',
		type: 'string',
		default: '',
		placeholder: '2026-01-01',
		displayOptions: { show: { ...show, operation: ['getAll', 'stats'] } },
		routing: { send: { type: 'body', property: 'date_from' } },
	},
	{
		displayName: 'Date To',
		name: 'date_to',
		type: 'string',
		default: '',
		placeholder: '2026-12-31',
		displayOptions: { show: { ...show, operation: ['getAll', 'stats'] } },
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

	// ── Create Option ──
	{
		displayName: 'Label',
		name: 'label',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { ...show, operation: ['createOption'] } },
		routing: { send: { type: 'body', property: 'label' } },
	},

	// ── Update Option ──
	{
		displayName: 'Option ID',
		name: 'option_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { ...show, operation: ['updateOption', 'deleteOption'] } },
		routing: { send: { type: 'body', property: 'option_id' } },
	},
	{
		displayName: 'Label',
		name: 'updateLabel',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { ...show, operation: ['updateOption'] } },
		routing: { send: { type: 'body', property: 'label' } },
	},
];
