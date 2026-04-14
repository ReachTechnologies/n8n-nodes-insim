import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class InsimApi implements ICredentialType {
	name = 'insimApi';

	displayName = 'inSIM API';

	documentationUrl = 'https://www.insim.app';

	properties: INodeProperties[] = [
		{
			displayName: 'Login (Email)',
			name: 'login',
			type: 'string',
			placeholder: 'name@example.com',
			default: '',
			required: true,
		},
		{
			displayName: 'Access Key',
			name: 'accessKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			body: {
				login: '={{$credentials.login}}',
				accessKey: '={{$credentials.accessKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://www.insim.app',
			url: '/api/v2/account',
			method: 'POST',
			body: {},
			skipSslCertificateValidation: true,
		},
	};
}
