import type { IHookFunctions, IWebhookFunctions, IDataObject, IHttpRequestMethods } from 'n8n-workflow';
/**
 * Make an authenticated API request to Personio.
 * Uses httpRequestWithAuthentication so the credential class's
 * preAuthentication hook handles token caching automatically.
 */
export declare function personioApiRequest(this: IHookFunctions | IWebhookFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject): Promise<IDataObject>;
//# sourceMappingURL=GenericFunctions.d.ts.map