"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonioTrigger = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
class PersonioTrigger {
    description = {
        displayName: 'Personio HR Trigger',
        name: 'personioHrTrigger',
        icon: 'file:personio.svg',
        group: ['trigger'],
        version: 1,
        subtitle: '={{$parameter["events"].join(", ")}}',
        description: 'Starts the workflow when Personio events occur',
        defaults: {
            name: 'Personio Trigger',
        },
        inputs: [],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'personioApi',
                required: true,
            },
        ],
        webhooks: [
            {
                name: 'default',
                httpMethod: 'POST',
                responseMode: 'onReceived',
                path: 'webhook',
            },
        ],
        properties: [
            {
                displayName: 'Events',
                name: 'events',
                type: 'multiOptions',
                required: true,
                default: [],
                description: 'The Personio events to listen for',
                options: [
                    // Person events
                    {
                        name: 'Person Created',
                        value: 'person.created',
                    },
                    {
                        name: 'Person Updated',
                        value: 'person.updated',
                    },
                    {
                        name: 'Person Deleted',
                        value: 'person.deleted',
                    },
                    // Employment events
                    {
                        name: 'Employment Created',
                        value: 'employment.created',
                    },
                    {
                        name: 'Employment Updated',
                        value: 'employment.updated',
                    },
                    {
                        name: 'Employment Cost Centers Updated',
                        value: 'employment.updated.cost-centers',
                    },
                    {
                        name: 'Employment Deleted',
                        value: 'employment.deleted',
                    },
                    {
                        name: 'Employment Started',
                        value: 'employment.started',
                    },
                    {
                        name: 'Employment Terminated',
                        value: 'employment.terminated',
                    },
                    // Absence period events
                    {
                        name: 'Absence Period Created',
                        value: 'absence-period.created',
                    },
                    {
                        name: 'Absence Period Status Updated',
                        value: 'absence-period.updated.status',
                    },
                    {
                        name: 'Absence Period Timerange Updated',
                        value: 'absence-period.updated.timerange',
                    },
                    {
                        name: 'Absence Period Deleted',
                        value: 'absence-period.deleted',
                    },
                    // Attendance period events
                    {
                        name: 'Attendance Period Created',
                        value: 'attendance-period.created',
                    },
                    {
                        name: 'Attendance Period Updated',
                        value: 'attendance-period.updated',
                    },
                    {
                        name: 'Attendance Period Deleted',
                        value: 'attendance-period.deleted',
                    },
                    // Document events
                    {
                        name: 'Document Created',
                        value: 'document.created',
                    },
                    {
                        name: 'Document Updated',
                        value: 'document.updated',
                    },
                    {
                        name: 'Document Deleted',
                        value: 'document.deleted',
                    },
                    {
                        name: 'Document Signed',
                        value: 'document.signed',
                    },
                ],
            },
        ],
    };
    webhookMethods = {
        default: {
            async checkExists() {
                const webhookData = this.getWorkflowStaticData('node');
                if (webhookData.webhookId === undefined) {
                    return false;
                }
                // Check if our webhook still exists in Personio
                try {
                    const response = (await GenericFunctions_1.personioApiRequest.call(this, 'GET', '/v2/webhooks'));
                    const webhooks = (response._data || response.data || []);
                    const exists = webhooks.some((webhook) => webhook.id === webhookData.webhookId);
                    if (!exists) {
                        delete webhookData.webhookId;
                        return false;
                    }
                    return true;
                }
                catch (_error) {
                    delete webhookData.webhookId;
                    return false;
                }
            },
            async create() {
                const webhookUrl = this.getNodeWebhookUrl('default');
                if (webhookUrl.includes('//localhost')) {
                    throw new n8n_workflow_1.NodeApiError(this.getNode(), {}, {
                        message: 'Webhooks cannot work on localhost. Please set up n8n on a public URL or use a tunnel.',
                    });
                }
                const events = this.getNodeParameter('events', []);
                const body = {
                    url: webhookUrl,
                    description: `n8n workflow ${this.getWorkflow().id ?? 'unknown'}`,
                    status: 'ENABLED',
                    auth_type: 'NONE',
                    enabled_events: events,
                };
                const response = (await GenericFunctions_1.personioApiRequest.call(this, 'POST', '/v2/webhooks', body));
                const data = response._data || response.data || response;
                const webhookId = data.id;
                if (!webhookId) {
                    throw new n8n_workflow_1.NodeApiError(this.getNode(), response, {
                        message: 'Personio did not return a webhook ID.',
                    });
                }
                const webhookData = this.getWorkflowStaticData('node');
                webhookData.webhookId = webhookId;
                return true;
            },
            async delete() {
                const webhookData = this.getWorkflowStaticData('node');
                if (webhookData.webhookId !== undefined) {
                    try {
                        await GenericFunctions_1.personioApiRequest.call(this, 'DELETE', `/v2/webhooks/${webhookData.webhookId}`);
                    }
                    catch (_error) {
                        // If deletion fails, still clean up static data
                    }
                    delete webhookData.webhookId;
                }
                return true;
            },
        },
    };
    async webhook() {
        const bodyData = this.getBodyData();
        return {
            workflowData: [this.helpers.returnJsonArray(bodyData)],
        };
    }
}
exports.PersonioTrigger = PersonioTrigger;
//# sourceMappingURL=PersonioTrigger.node.js.map