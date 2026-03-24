import type {
	IHookFunctions,
	IWebhookFunctions,
	IDataObject,
	IHttpRequestMethods,
	IHttpRequestOptions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

/**
 * Make an authenticated API request to Personio.
 * Uses httpRequestWithAuthentication so the credential class's
 * preAuthentication hook handles token caching automatically.
 */
export async function personioApiRequest(
	this: IHookFunctions | IWebhookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
): Promise<IDataObject> {
	const options: IHttpRequestOptions = {
		method,
		url: `https://api.personio.de${endpoint}`,
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json, application/problem+json',
		},
		json: true,
	};

	if (body && Object.keys(body).length > 0 && method !== 'GET') {
		options.body = body;
	}

	try {
		return (await this.helpers.httpRequestWithAuthentication.call(
			this,
			'personioApi',
			options,
		)) as IDataObject;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
