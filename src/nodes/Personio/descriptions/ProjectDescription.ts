import type { INodeProperties, IHttpRequestOptions } from 'n8n-workflow';
import type { IExecuteSingleFunctions } from 'n8n-workflow';

export const projectOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['project'],
			},
		},
		options: [
			{
				name: 'Add Members',
				value: 'addMembers',
				description: 'Add members to a project',
				action: 'Add members to a project',
				routing: {
					request: {
						method: 'POST',
						url: '=/v2/projects/{{$parameter.projectId}}/members',
					},
				},
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a project',
				action: 'Create a project',
				routing: {
					request: {
						method: 'POST',
						url: '/v2/projects',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a project',
				action: 'Delete a project',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/v2/projects/{{$parameter.projectId}}',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a project by ID',
				action: 'Get a project',
				routing: {
					request: {
						method: 'GET',
						url: '=/v2/projects/{{$parameter.projectId}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many projects',
				action: 'Get many projects',
				routing: {
					request: {
						method: 'GET',
						url: '/v2/projects',
					},
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								properties: {
									property: '_data',
								},
							},
						],
					},
					operations: {
						pagination: {
							type: 'generic',
							properties: {
								continue: '={{ Boolean($response.body._meta?.links?.next) }}',
								request: {
									url: '={{ $response.body._meta?.links?.next?.href }}',
								},
							},
						},
					},
				},
			},
			{
				name: 'Get Members',
				value: 'getMembers',
				description: 'Get members of a project',
				action: 'Get project members',
				routing: {
					request: {
						method: 'GET',
						url: '=/v2/projects/{{$parameter.projectId}}/members',
					},
				},
			},
			{
				name: 'Remove Members',
				value: 'removeMembers',
				description: 'Remove members from a project',
				action: 'Remove members from a project',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/v2/projects/{{$parameter.projectId}}/members',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a project',
				action: 'Update a project',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/v2/projects/{{$parameter.projectId}}',
					},
				},
			},
		],
		default: 'getAll',
	},
];

export const projectFields: INodeProperties[] = [
	// ----------------------------------
	//         project: shared
	// ----------------------------------
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['get', 'update', 'delete', 'getMembers', 'addMembers', 'removeMembers'],
			},
		},
		description: 'The ID of the project',
	},

	// ----------------------------------
	//         project: create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['create'],
			},
		},
		description: 'Name of the project (max 255 characters)',
		routing: {
			send: {
				type: 'body',
				property: 'name',
			},
		},
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		required: true,
		default: 'ACTIVE',
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['create'],
			},
		},
		options: [
			{
				name: 'Active',
				value: 'ACTIVE',
			},
			{
				name: 'Archived',
				value: 'ARCHIVED',
			},
		],
		description: 'Status of the project',
		routing: {
			send: {
				type: 'body',
				property: 'status',
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Assigned to All',
				name: 'assignedToAll',
				type: 'boolean',
				default: false,
				description: 'Whether the project is assigned to all employees',
				routing: {
					send: {
						type: 'body',
						property: 'assigned_to_all',
					},
				},
			},
			{
				displayName: 'Billable',
				name: 'billable',
				type: 'boolean',
				default: false,
				description: 'Whether the project is billable',
				routing: {
					send: {
						type: 'body',
						property: 'billable',
					},
				},
			},
			{
				displayName: 'Client Name',
				name: 'clientName',
				type: 'string',
				default: '',
				description: 'Client name (max 255 characters)',
				routing: {
					send: {
						type: 'body',
						property: 'client_name',
					},
				},
			},
			{
				displayName: 'Cost Center ID',
				name: 'costCenterId',
				type: 'string',
				default: '',
				description: 'ID of the cost center to assign',
				routing: {
					send: {
						type: 'body',
						property: 'cost_center.id',
					},
				},
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Project description (max 1000 characters)',
				routing: {
					send: {
						type: 'body',
						property: 'description',
					},
				},
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'string',
				default: '',
				placeholder: 'YYYY-MM-DD',
				description: 'Project end date',
				routing: {
					send: {
						type: 'body',
						property: 'end.date',
					},
				},
			},
			{
				displayName: 'Parent Project ID',
				name: 'parentProjectId',
				type: 'string',
				default: '',
				description: 'ID of the parent project (for sub-projects, max 1 level nesting)',
				routing: {
					send: {
						type: 'body',
						property: 'parent_project.id',
					},
				},
			},
			{
				displayName: 'Project Code',
				name: 'projectCode',
				type: 'string',
				default: '',
				description: 'Unique project code',
				routing: {
					send: {
						type: 'body',
						property: 'project_code',
					},
				},
			},
			{
				displayName: 'Project Type',
				name: 'projectType',
				type: 'string',
				default: '',
				description: 'Free-text project type (max 255 characters)',
				routing: {
					send: {
						type: 'body',
						property: 'project_type',
					},
				},
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'string',
				default: '',
				placeholder: 'YYYY-MM-DD',
				description: 'Project start date',
				routing: {
					send: {
						type: 'body',
						property: 'start.date',
					},
				},
			},
		],
	},

	// ----------------------------------
	//         project: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['getAll'],
			},
		},
		description: 'Whether to return all results or only up to a given limit',
		routing: {
			send: {
				paginate: '={{ $parameter.returnAll }}',
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: {
			minValue: 1,
			maxValue: 200,
		},
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
		routing: {
			send: {
				type: 'query',
				property: 'limit',
			},
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'query',
						property: 'name',
					},
				},
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				default: '',
				options: [
					{ name: 'Active', value: 'ACTIVE' },
					{ name: 'Archived', value: 'ARCHIVED' },
				],
				routing: {
					send: {
						type: 'query',
						property: 'status',
					},
				},
			},
			{
				displayName: 'Top Level Only',
				name: 'topLevelOnly',
				type: 'boolean',
				default: false,
				routing: {
					send: {
						type: 'query',
						property: 'top_level_only',
					},
				},
			},
		],
	},

	// ----------------------------------
	//         project: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Assigned to All',
				name: 'assignedToAll',
				type: 'boolean',
				default: false,
				routing: {
					send: {
						type: 'body',
						property: 'assigned_to_all',
					},
				},
			},
			{
				displayName: 'Billable',
				name: 'billable',
				type: 'boolean',
				default: false,
				routing: {
					send: {
						type: 'body',
						property: 'billable',
					},
				},
			},
			{
				displayName: 'Client Name',
				name: 'clientName',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'client_name',
					},
				},
			},
			{
				displayName: 'Cost Center ID',
				name: 'costCenterId',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'cost_center.id',
					},
				},
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'description',
					},
				},
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'string',
				default: '',
				placeholder: 'YYYY-MM-DD',
				routing: {
					send: {
						type: 'body',
						property: 'end.date',
					},
				},
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'name',
					},
				},
			},
			{
				displayName: 'Project Code',
				name: 'projectCode',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'project_code',
					},
				},
			},
			{
				displayName: 'Project Type',
				name: 'projectType',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'project_type',
					},
				},
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'string',
				default: '',
				placeholder: 'YYYY-MM-DD',
				routing: {
					send: {
						type: 'body',
						property: 'start.date',
					},
				},
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				default: 'ACTIVE',
				options: [
					{ name: 'Active', value: 'ACTIVE' },
					{ name: 'Archived', value: 'ARCHIVED' },
				],
				routing: {
					send: {
						type: 'body',
						property: 'status',
					},
				},
			},
		],
	},

	// ----------------------------------
	//         project: addMembers / removeMembers
	// ----------------------------------
	{
		displayName: 'Person IDs',
		name: 'personIds',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['addMembers', 'removeMembers'],
			},
		},
		description: 'Comma-separated list of person IDs to add/remove',
		routing: {
			send: {
				type: 'body',
				property: '_personIds',
				preSend: [
					async function (
						this: IExecuteSingleFunctions,
						requestOptions: IHttpRequestOptions,
					): Promise<IHttpRequestOptions> {
						const body = requestOptions.body as Record<string, unknown>;
						const ids = (body._personIds as string).split(',').map((id: string) => id.trim());
						requestOptions.body = ids.map((id: string) => ({ person: { id } }));
						return requestOptions;
					},
				],
			},
		},
	},
];
