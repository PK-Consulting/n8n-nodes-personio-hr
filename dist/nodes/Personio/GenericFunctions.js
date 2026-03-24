"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.personioApiRequest = personioApiRequest;
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
//# sourceMappingURL=GenericFunctions.js.map