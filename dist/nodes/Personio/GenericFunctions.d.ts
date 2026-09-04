import type { IHookFunctions, IWebhookFunctions, IExecuteSingleFunctions, IDataObject, IHttpRequestMethods, IN8nHttpFullResponse, INodeExecutionData } from 'n8n-workflow';
/**
 * Make an authenticated API request to Personio.
 * Uses httpRequestWithAuthentication so the credential class's
 * preAuthentication hook handles token caching automatically.
 */
export declare function personioApiRequest(this: IHookFunctions | IWebhookFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject): Promise<IDataObject>;
/**
 * postReceive hook that unwraps Personio v2 responses.
 *
 * List endpoints answer with `{ _data: [...], _meta: {...} }` and single-resource
 * endpoints (e.g. GET /v2/persons/{id}) answer with the bare object. A declarative
 * `rootProperty: '_data'` returns an empty item for the latter, so this helper
 * unwraps `_data` when present and otherwise passes the body through unchanged.
 */
export declare function extractData(this: IExecuteSingleFunctions, items: INodeExecutionData[], _response: IN8nHttpFullResponse): Promise<INodeExecutionData[]>;
//# sourceMappingURL=GenericFunctions.d.ts.map