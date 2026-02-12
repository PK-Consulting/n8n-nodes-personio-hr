import type {
	IHookFunctions,
	IWebhookFunctions,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeConnectionTypes } from 'n8n-workflow';

import { personioApiRequest } from './GenericFunctions';

export class PersonioTrigger implements INodeType {
	description: INodeTypeDescription = {
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
		outputs: [NodeConnectionTypes.Main],
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
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId === undefined) {
					return false;
				}

				// Check if our webhook still exists in Personio
				try {
					const response = (await personioApiRequest.call(
						this,
						'GET',
						'/v2/webhooks',
					)) as IDataObject;

					const webhooks = ((response as any)._data || response.data || []) as IDataObject[];
					const exists = webhooks.some(
						(webhook: IDataObject) => webhook.id === webhookData.webhookId,
					);

					if (!exists) {
						delete webhookData.webhookId;
						return false;
					}

					return true;
				} catch (_error) {
					delete webhookData.webhookId;
					return false;
				}
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;

				if (webhookUrl.includes('//localhost')) {
					throw new NodeApiError(this.getNode(), {} as JsonObject, {
						message:
							'Webhooks cannot work on localhost. Please set up n8n on a public URL or use a tunnel.',
					});
				}

				const events = this.getNodeParameter('events', []) as string[];

				const body = {
					url: webhookUrl,
					description: `n8n workflow ${this.getWorkflow().id ?? 'unknown'}`,
					status: 'ENABLED',
					auth_type: 'NONE',
					enabled_events: events,
				} as IDataObject;

				const response = (await personioApiRequest.call(
					this,
					'POST',
					'/v2/webhooks',
					body,
				)) as IDataObject;

				const data = (response as any)._data || response.data || response;
				const webhookId = (data as IDataObject).id;

				if (!webhookId) {
					throw new NodeApiError(this.getNode(), response as JsonObject, {
						message: 'Personio did not return a webhook ID.',
					});
				}

				const webhookData = this.getWorkflowStaticData('node');
				webhookData.webhookId = webhookId;

				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId !== undefined) {
					try {
						await personioApiRequest.call(
							this,
							'DELETE',
							`/v2/webhooks/${webhookData.webhookId}`,
						);
					} catch (_error) {
						// If deletion fails, still clean up static data
					}

					delete webhookData.webhookId;
				}

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData() as IDataObject;

		return {
			workflowData: [this.helpers.returnJsonArray(bodyData)],
		};
	}
}
