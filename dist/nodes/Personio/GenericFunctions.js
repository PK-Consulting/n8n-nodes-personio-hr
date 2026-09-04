"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.personioApiRequest = personioApiRequest;
exports.extractData = extractData;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make an authenticated API request to Personio.
 * Uses httpRequestWithAuthentication so the credential class's
 * preAuthentication hook handles token caching automatically.
 */
async function personioApiRequest(method, endpoint, body) {
    const options = {
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
        return (await this.helpers.httpRequestWithAuthentication.call(this, 'personioApi', options));
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
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
async function extractData(items, _response) {
    return items.flatMap((item) => {
        const data = item.json?._data;
        if (Array.isArray(data)) {
            return data.map((entry) => ({ json: entry }));
        }
        if (data !== null && typeof data === 'object') {
            return [{ json: data }];
        }
        return [item];
    });
}
//# sourceMappingURL=GenericFunctions.js.map