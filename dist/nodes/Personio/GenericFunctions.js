"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.personioApiRequest = personioApiRequest;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Fetch a fresh access token from the Personio auth endpoint.
 */
async function getAccessToken(self) {
    const credentials = await self.getCredentials('personioApi');
    const response = (await self.helpers.httpRequest({
        method: 'POST',
        url: 'https://api.personio.de/v2/auth/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
        },
        body: `client_id=${encodeURIComponent(credentials.clientId)}&client_secret=${encodeURIComponent(credentials.clientSecret)}&grant_type=client_credentials`,
    }));
    return response.access_token;
}
/**
 * Make an authenticated API request to Personio.
 */
async function personioApiRequest(method, endpoint, body) {
    const token = await getAccessToken(this);
    const options = {
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
        return (await this.helpers.httpRequest(options));
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
//# sourceMappingURL=GenericFunctions.js.map