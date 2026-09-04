import type {
	IHookFunctions,
	IWebhookFunctions,
	IExecuteSingleFunctions,
	IDataObject,
	IHttpRequestMethods,
	IHttpRequestOptions,
	IN8nHttpFullResponse,
	INodeExecutionData,
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

/**
 * postReceive hook that unwraps Personio v2 responses.
 *
 * List endpoints answer with `{ _data: [...], _meta: {...} }` and single-resource
 * endpoints (e.g. GET /v2/persons/{id}) answer with the bare object. A declarative
 * `rootProperty: '_data'` returns an empty item for the latter, so this helper
 * unwraps `_data` when present and otherwise passes the body through unchanged.
 */
export async function extractData(
	this: IExecuteSingleFunctions,
	items: INodeExecutionData[],
	_response: IN8nHttpFullResponse,
): Promise<INodeExecutionData[]> {
	return items.flatMap((item) => {
		const data = (item.json as IDataObject)?._data;
		if (Array.isArray(data)) {
			return data.map((entry) => ({ json: entry as IDataObject }));
		}
		if (data !== null && typeof data === 'object') {
			return [{ json: data as IDataObject }];
		}
		return [item];
	});
}