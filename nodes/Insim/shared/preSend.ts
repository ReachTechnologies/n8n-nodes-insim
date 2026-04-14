import type { IExecuteSingleFunctions, IHttpRequestOptions } from 'n8n-workflow';

/**
 * preSend hook that removes empty/null/undefined values from the POST body.
 * The inSIM API interprets empty strings as active filters, returning 0 results.
 * This must be applied to every operation via routing.send.preSend.
 */
export async function filterEmptyParams(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const body = requestOptions.body as Record<string, unknown> | undefined;
	if (body && typeof body === 'object') {
		const filtered: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(body)) {
			if (value === '' || value === null || value === undefined) continue;
			if (Array.isArray(value) && value.length === 0) continue;
			filtered[key] = value;
		}
		requestOptions.body = filtered;
	}
	return requestOptions;
}

/**
 * preSend hook for SMS send: wraps phone_number + message + url + priority
 * into the messages[] array expected by /api/v2/sendsms.
 */
export async function wrapSmsMessage(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const body = requestOptions.body as Record<string, unknown> | undefined;
	if (body) {
		const { login, accessKey, phone_number, message, url, priority, ...rest } = body;
		requestOptions.body = {
			login,
			accessKey,
			...rest,
			messages: [
				{
					phone_number,
					message,
					url: url || '',
					priority: priority || 1,
					date_to_send: new Date().toISOString().replace('T', ' ').substring(0, 19),
				},
			],
		};
	}
	return requestOptions;
}

/**
 * preSend hook for add contacts: wraps contact fields into contacts[] array
 * expected by /api/v2/addcontacts.
 */
export async function wrapContact(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const body = requestOptions.body as Record<string, unknown> | undefined;
	if (body) {
		const { login, accessKey, phone_number, firstname, lastname, email, address, ...rest } = body;
		const contact: Record<string, unknown> = { phone_number };
		if (firstname) contact.firstname = firstname;
		if (lastname) contact.lastname = lastname;
		if (email) contact.email = email;
		if (address) contact.address = address;
		requestOptions.body = { login, accessKey, ...rest, contacts: [contact] };
	}
	return requestOptions;
}

/**
 * preSend hook for template send: wraps recipient into recipients[] array.
 */
export async function wrapTemplateRecipient(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const body = requestOptions.body as Record<string, unknown> | undefined;
	if (body) {
		const { login, accessKey, template_id, phone_number, variables, ...rest } = body;
		let parsedVars: Record<string, string> = {};
		if (typeof variables === 'string' && variables) {
			try {
				parsedVars = JSON.parse(variables);
			} catch {
				parsedVars = {};
			}
		}
		requestOptions.body = {
			login,
			accessKey,
			template_id,
			...rest,
			recipients: [{ phone_number, variables: parsedVars }],
		};
	}
	return requestOptions;
}
