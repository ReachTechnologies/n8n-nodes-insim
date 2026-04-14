import type { INodeProperties } from 'n8n-workflow';
import { filterEmptyParams } from '../../shared/preSend';

const show = { resource: ['stat'] };

export const statDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show },
		options: [
			{
				name: 'Clicks',
				value: 'clicks',
				action: 'Get link click tracking details',
				routing: {
					request: { method: 'POST', url: '/api/v2/stats/clicks' },
					send: { preSend: [filterEmptyParams] },
				},
			},
			{
				name: 'Overview',
				value: 'overview',
				action: 'Get account statistics overview',
				routing: {
					request: { method: 'POST', url: '/api/v2/stats/overview' },
					send: { preSend: [filterEmptyParams] },
				},
			},
		],
		default: 'overview',
	},

	// ── Overview ──
	{
		displayName: 'Date From',
		name: 'date_from',
		type: 'string',
		default: '',
		placeholder: '2026-01-01',
		displayOptions: { show: { ...show, operation: ['overview'] } },
		routing: { send: { type: 'body', property: 'date_from' } },
	},
	{
		displayName: 'Date To',
		name: 'date_to',
		type: 'string',
		default: '',
		placeholder: '2026-12-31',
		displayOptions: { show: { ...show, operation: ['overview'] } },
		routing: { send: { type: 'body', property: 'date_to' } },
	},

	// ── Clicks ──
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 10,
		displayOptions: { show: { ...show, operation: ['clicks'] } },
		routing: { send: { type: 'body', property: 'limit' } },
	},
];
