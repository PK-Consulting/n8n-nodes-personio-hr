import type {
	IHookFunctions,
	IWebhookFunctions,
	IDataObject,
	IHttpRequestMethods,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

/**
 * Fetch a fresh access token from the Personio auth endpoint.
 */
async function getAccessToken(
	self: IHookFunctions | IWebhookFunctions,
): Promise<string> {
	const credentials = await self.getCredentials('personioApi');

	const response = (await self.helpers.httpRequest({
		method: 'POST',
		url: 'https://api.personio.de/v2/auth/token',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Accept: 'application/json',
		},
		body: `client_id=${encodeURIComponent(credentials.clientId as string)}&client_secret=${encodeURIComponent(credentials.clientSecret as string)}&grant_type=client_credentials`,
	})) as { access_token: string };

	return response.access_token;
}

/**
 * Make an authenticated API request to Personio.
 */
export async function personioApiRequest(
	this: IHookFunctions | IWebhookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
): Promise<IDataObject> {
	const token = await getAccessToken(this);

	const options: IDataObject = {
		method,
		url: `https://api.personio.de${endpoint}`,
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
			Accept: 'application/json, application/problem+json',
		},
		json: true,
	};

	if (body && Object.keys(body).length > 0 && method !== 'GET') {
		options.body = body;
	}

	try {
		return (await this.helpers.httpRequest(options as any)) as IDataObject;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
