import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { contactDescription } from './resources/contact';
import { smsDescription } from './resources/sms';
import { callDescription } from './resources/call';
import { listDescription } from './resources/list';
import { campaignDescription } from './resources/campaign';
import { templateDescription } from './resources/template';
import { statDescription } from './resources/stat';
import { qualificationDescription } from './resources/qualification';
import { accountDescription } from './resources/account';

export class Insim implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'inSIM',
		name: 'insim',
		icon: 'file:insim.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage SMS, contacts, campaigns, calls, and CRM with inSIM',
		defaults: {
			name: 'inSIM',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'insimApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://www.insim.app',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			skipSslCertificateValidation: true,
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Account', value: 'account' },
					{ name: 'Call', value: 'call' },
					{ name: 'Campaign', value: 'campaign' },
					{ name: 'Contact', value: 'contact' },
					{ name: 'List', value: 'list' },
					{ name: 'Qualification', value: 'qualification' },
					{ name: 'SMS', value: 'sms' },
					{ name: 'Stat', value: 'stat' },
					{ name: 'Template', value: 'template' },
				],
				default: 'contact',
			},
			...contactDescription,
			...smsDescription,
			...callDescription,
			...listDescription,
			...campaignDescription,
			...templateDescription,
			...statDescription,
			...qualificationDescription,
			...accountDescription,
		],
	};
}
