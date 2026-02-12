"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonioApi = void 0;
class PersonioApi {
    name = 'personioApi';
    displayName = 'Personio API';
    documentationUrl = 'https://developer.personio.de/docs/getting-started-with-the-personio-api';
    properties = [
        {
            displayName: 'Client ID',
            name: 'clientId',
            type: 'string',
            default: '',
            required: true,
            description: 'The Client ID from your Personio API credentials (Settings → API credentials)',
        },
        {
            displayName: 'Client Secret',
            name: 'clientSecret',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            required: true,
            description: 'The Client Secret from your Personio API credentials',
        },
        {
            displayName: 'Access Token',
            name: 'accessToken',
            type: 'hidden',
            typeOptions: {
                expirable: true,
            },
            default: '',
        },
        {
            displayName: 'Expires At',
            name: 'expiresAt',
            type: 'hidden',
            default: 0,
        },
    ];
    async preAuthentication(credentials) {
        const response = (await this.helpers.httpRequest({
            method: 'POST',
            url: 'https://api.personio.de/v2/auth/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json',
            },
            body: `client_id=${encodeURIComponent(credentials.clientId)}&client_secret=${encodeURIComponent(credentials.clientSecret)}&grant_type=client_credentials`,
        }));
        const expiresAt = Date.now() + 23 * 60 * 60 * 1000; // 23 hours (token valid for 24h)
        return { accessToken: response.access_token, expiresAt };
    }
    authenticate = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '=Bearer {{$credentials.accessToken}}',
            },
        },
    };
    test = {
        request: {
            baseURL: 'https://api.personio.de',
            url: '/v2/persons',
            qs: { limit: '1' },
        },
    };
}
exports.PersonioApi = PersonioApi;
//# sourceMappingURL=PersonioApi.credentials.js.map