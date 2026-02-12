import type { INodeProperties, IHttpRequestOptions } from 'n8n-workflow';
import type { IExecuteSingleFunctions } from 'n8n-workflow';

export const personOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['person'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new person (employee)',
				action: 'Create a person',
				routing: {
					request: {
						method: 'POST',
						url: '/v2/persons',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a person',
				action: 'Delete a person',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/v2/persons/{{$parameter.personId}}',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a person by ID',
				action: 'Get a person',
				routing: {
					request: {
						method: 'GET',
						url: '=/v2/persons/{{$parameter.personId}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many persons',
				action: 'Get many persons',
				routing: {
					request: {
						method: 'GET',
						url: '/v2/persons',
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
				name: 'Update',
				value: 'update',
				description: 'Update a person',
				action: 'Update a person',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/v2/persons/{{$parameter.personId}}',
					},
				},
			},
		],
		default: 'getAll',
	},
];

export const personFields: INodeProperties[] = [
	// ----------------------------------
	//         person: shared
	// ----------------------------------
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['person'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the person',
	},

	// ----------------------------------
	//         person: create
	// ----------------------------------
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['person'],
				operation: ['create'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'email',
			},
		},
	},
	{
		displayName: 'First Name',
		name: 'firstName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['person'],
				operation: ['create'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'first_name',
			},
		},
	},
	{
		displayName: 'Last Name',
		name: 'lastName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['person'],
				operation: ['create'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'last_name',
			},
		},
	},
	{
		displayName: 'Language',
		name: 'languageCode',
		type: 'options',
		required: true,
		default: 'en',
		options: [
			{ name: 'German', value: 'de' },
			{ name: 'English', value: 'en' },
			{ name: 'Spanish', value: 'es' },
			{ name: 'Finnish', value: 'fi' },
			{ name: 'French', value: 'fr' },
			{ name: 'Italian', value: 'it' },
			{ name: 'Dutch', value: 'nl' },
			{ name: 'Swedish', value: 'sv' },
		],
		displayOptions: {
			show: {
				resource: ['person'],
				operation: ['create'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'language_code',
			},
		},
	},
	{
		displayName: 'Employment Status',
		name: 'employmentStatus',
		type: 'options',
		required: true,
		default: 'ACTIVE',
		options: [
			{ name: 'Active', value: 'ACTIVE' },
			{ name: 'Inactive', value: 'INACTIVE' },
			{ name: 'Leave', value: 'LEAVE' },
			{ name: 'Onboarding', value: 'ONBOARDING' },
		],
		displayOptions: {
			show: {
				resource: ['person'],
				operation: ['create'],
			},
		},
		description: 'The employment status of the person',
	},
	{
		displayName: 'Employment Start Date',
		name: 'employmentStartDate',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'YYYY-MM-DD',
		displayOptions: {
			show: {
				resource: ['person'],
				operation: ['create'],
			},
		},
		description: 'The start date of the employment (YYYY-MM-DD)',
	},
	{
		displayName: 'Employment Type',
		name: 'employmentType',
		type: 'options',
		required: true,
		default: 'INTERNAL',
		options: [
			{ name: 'Internal', value: 'INTERNAL' },
			{ name: 'External', value: 'EXTERNAL' },
		],
		displayOptions: {
			show: {
				resource: ['person'],
				operation: ['create'],
			},
		},
		description: 'Whether the employee is internal or external',
		// This field uses a preSend hook to build the full employments array
		// from all employment-related parameters (required + optional)
		routing: {
			send: {
				type: 'body',
				property: '_buildEmployments',
				preSend: [
					async function (
						this: IExecuteSingleFunctions,
						requestOptions: IHttpRequestOptions,
					): Promise<IHttpRequestOptions> {
						const body = requestOptions.body as Record<string, unknown>;

						// Build the employment object from required params
						const employment: Record<string, unknown> = {
							status: this.getNodeParameter('employmentStatus') as string,
							employment_start_date: this.getNodeParameter('employmentStartDate') as string,
							type: this.getNodeParameter('employmentType') as string,
						};

						// Get optional employment fields from additionalFields
						const additionalFields = this.getNodeParameter('additionalFields', {}) as Record<string, unknown>;

						if (additionalFields.position) {
							employment.position = { title: additionalFields.position as string };
						}
						if (additionalFields.supervisorId) {
							employment.supervisor = { id: String(additionalFields.supervisorId) };
						}
						if (additionalFields.officeId) {
							employment.office = { id: String(additionalFields.officeId) };
						}
						if (additionalFields.legalEntityId) {
							employment.legal_entity = { id: String(additionalFields.legalEntityId) };
						}
						if (additionalFields.contractEndDate) {
							employment.contract_end_date = additionalFields.contractEndDate as string;
						}
						if (additionalFields.probationEndDate) {
							employment.probation_end_date = additionalFields.probationEndDate as string;
						}
						if (additionalFields.probationPeriodLength !== undefined && additionalFields.probationPeriodLength !== '') {
							employment.probation_period_length = additionalFields.probationPeriodLength as number;
						}
						if (additionalFields.weeklyWorkingHours !== undefined && additionalFields.weeklyWorkingHours !== '') {
							employment.weekly_working_hours = additionalFields.weeklyWorkingHours as number;
						}
						if (additionalFields.fullTimeWeeklyWorkingHours !== undefined && additionalFields.fullTimeWeeklyWorkingHours !== '') {
							employment.full_time_weekly_working_hours = additionalFields.fullTimeWeeklyWorkingHours as number;
						}

						// Department (org_units with type "department")
						if (additionalFields.departmentId) {
							if (!employment.org_units) {
								employment.org_units = [];
							}
							(employment.org_units as Array<Record<string, string>>).push({
								type: 'department',
								id: String(additionalFields.departmentId),
							});
						}

						// Team (org_units with type "team")
						if (additionalFields.teamId) {
							if (!employment.org_units) {
								employment.org_units = [];
							}
							(employment.org_units as Array<Record<string, string>>).push({
								type: 'team',
								id: String(additionalFields.teamId),
							});
						}

						// Cost centers (comma-separated IDs with equal weight)
						if (additionalFields.costCenterIds) {
							const ids = (additionalFields.costCenterIds as string)
								.split(',')
								.map((id: string) => id.trim())
								.filter((id: string) => id);
							if (ids.length > 0) {
								const weight = Math.floor(100 / ids.length);
								const remainder = 100 - weight * ids.length;
								employment.cost_centers = ids.map((id: string, index: number) => ({
									id,
									weight: index === 0 ? weight + remainder : weight,
								}));
							}
						}

						// Set the employments array and remove the temp property
						body.employments = [employment];
						delete body._buildEmployments;

						requestOptions.body = body;
						return requestOptions;
					},
				],
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
				resource: ['person'],
				operation: ['create'],
			},
		},
		options: [
			// --- Person-level optional fields ---
			{
				displayName: 'Gender',
				name: 'gender',
				type: 'options',
				default: 'UNDEFINED',
				options: [
					{ name: 'Diverse', value: 'DIVERSE' },
					{ name: 'Female', value: 'FEMALE' },
					{ name: 'Male', value: 'MALE' },
					{ name: 'Unknown', value: 'UNKNOWN' },
					{ name: 'Undefined', value: 'UNDEFINED' },
				],
				routing: {
					send: {
						type: 'body',
						property: 'gender',
					},
				},
			},
			{
				displayName: 'Preferred Name',
				name: 'preferredName',
				type: 'string',
				default: '',
				description: 'Alternative display name',
				routing: {
					send: {
						type: 'body',
						property: 'preferred_name',
					},
				},
			},
			// --- Employment-level optional fields (read by preSend hook) ---
			{
				displayName: 'Position Title',
				name: 'position',
				type: 'string',
				default: '',
				description: 'Job title for the employment (e.g. "Senior Account Manager")',
			},
			{
				displayName: 'Supervisor ID',
				name: 'supervisorId',
				type: 'string',
				default: '',
				description: 'Person ID of the supervisor / manager',
			},
			{
				displayName: 'Office ID',
				name: 'officeId',
				type: 'string',
				default: '',
				description: 'ID of the office location',
			},
			{
				displayName: 'Department ID',
				name: 'departmentId',
				type: 'string',
				default: '',
				description: 'ID of the department (org unit)',
			},
			{
				displayName: 'Team ID',
				name: 'teamId',
				type: 'string',
				default: '',
				description: 'ID of the team (org unit)',
			},
			{
				displayName: 'Legal Entity ID',
				name: 'legalEntityId',
				type: 'string',
				default: '',
				description: 'ID of the legal entity',
			},
			{
				displayName: 'Contract End Date',
				name: 'contractEndDate',
				type: 'string',
				default: '',
				placeholder: 'YYYY-MM-DD',
				description: 'End date of the contract (for fixed-term contracts)',
			},
			{
				displayName: 'Probation End Date',
				name: 'probationEndDate',
				type: 'string',
				default: '',
				placeholder: 'YYYY-MM-DD',
				description: 'End date of the probation period (mutually exclusive with Probation Period Length)',
			},
			{
				displayName: 'Probation Period Length',
				name: 'probationPeriodLength',
				type: 'number',
				default: '',
				description: 'Probation period in days (mutually exclusive with Probation End Date)',
				typeOptions: {
					minValue: 0,
				},
			},
			{
				displayName: 'Weekly Working Hours',
				name: 'weeklyWorkingHours',
				type: 'number',
				default: '',
				description: 'Contracted working hours per week (e.g. 37.5)',
				typeOptions: {
					minValue: 0,
					numberPrecision: 2,
				},
			},
			{
				displayName: 'Full-Time Weekly Working Hours',
				name: 'fullTimeWeeklyWorkingHours',
				type: 'number',
				default: '',
				description: 'Full-time hours benchmark for FTE calculation (e.g. 40)',
				typeOptions: {
					minValue: 0,
					numberPrecision: 2,
				},
			},
			{
				displayName: 'Cost Center IDs',
				name: 'costCenterIds',
				type: 'string',
				default: '',
				placeholder: '653',
				description: 'Comma-separated cost center IDs (weights auto-distributed equally, first gets remainder)',
			},
		],
	},

	// ----------------------------------
	//         person: create — custom attributes
	// ----------------------------------
	{
		displayName: 'Custom Attributes',
		name: 'customAttributes',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
			multipleValueButtonText: 'Add Attribute',
		},
		default: {},
		placeholder: 'Add Attribute',
		displayOptions: {
			show: {
				resource: ['person'],
				operation: ['create'],
			},
		},
		description: 'Custom attributes to set on the person. Each Personio instance has unique attribute IDs (e.g. "dynamic_12345" or "laptop_serial_number").',
		options: [
			{
				name: 'attributes',
				displayName: 'Attribute',
				values: [
					{
						displayName: 'Attribute ID',
						name: 'id',
						type: 'string',
						default: '',
						required: true,
						description: 'The custom attribute ID (e.g. "laptop_serial_number" or "dynamic_12345")',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						required: true,
						description: 'The value — for multi-value/tags use a JSON array like ["mouse","keyboard","monitor"]',
					},
				],
			},
		],
		routing: {
			send: {
				type: 'body',
				property: '_customAttributes',
				preSend: [
					async function (
						this: IExecuteSingleFunctions,
						requestOptions: IHttpRequestOptions,
					): Promise<IHttpRequestOptions> {
						const body = requestOptions.body as Record<string, unknown>;
						const customAttrsParam = this.getNodeParameter('customAttributes', {}) as {
							attributes?: Array<{ id: string; value: string }>;
						};
						const rows = customAttrsParam.attributes ?? [];

						if (rows.length > 0) {
							body.custom_attributes = rows.map((row) => {
								let parsedValue: string | string[];
								try {
									const parsed = JSON.parse(row.value);
									if (Array.isArray(parsed)) {
										parsedValue = parsed;
									} else {
										parsedValue = row.value;
									}
								} catch {
									parsedValue = row.value;
								}
								return { id: row.id, value: parsedValue };
							});
						}

						delete body._customAttributes;
						requestOptions.body = body;
						return requestOptions;
					},
				],
			},
		},
	},

	// ----------------------------------
	//         person: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['person'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				placeholder: 'name@email.com',
				description: 'Must be unique across all employees',
				routing: {
					send: {
						type: 'body',
						property: 'email',
					},
				},
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'first_name',
					},
				},
			},
			{
				displayName: 'Gender',
				name: 'gender',
				type: 'options',
				default: 'UNDEFINED',
				options: [
					{ name: 'Diverse', value: 'DIVERSE' },
					{ name: 'Female', value: 'FEMALE' },
					{ name: 'Male', value: 'MALE' },
					{ name: 'Unknown', value: 'UNKNOWN' },
					{ name: 'Undefined', value: 'UNDEFINED' },
				],
				routing: {
					send: {
						type: 'body',
						property: 'gender',
					},
				},
			},
			{
				displayName: 'Language',
				name: 'languageCode',
				type: 'options',
				default: 'en',
				options: [
					{ name: 'German', value: 'de' },
					{ name: 'English', value: 'en' },
					{ name: 'Spanish', value: 'es' },
					{ name: 'Finnish', value: 'fi' },
					{ name: 'French', value: 'fr' },
					{ name: 'Italian', value: 'it' },
					{ name: 'Dutch', value: 'nl' },
					{ name: 'Swedish', value: 'sv' },
				],
				routing: {
					send: {
						type: 'body',
						property: 'language_code',
					},
				},
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'last_name',
					},
				},
			},
			{
				displayName: 'Preferred Name',
				name: 'preferredName',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'preferred_name',
					},
				},
			},
		],
	},

	// ----------------------------------
	//         person: update — custom attributes
	// ----------------------------------
	{
		displayName: 'Custom Attributes',
		name: 'customAttributes',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
			multipleValueButtonText: 'Add Attribute',
		},
		default: {},
		placeholder: 'Add Attribute',
		displayOptions: {
			show: {
				resource: ['person'],
				operation: ['update'],
			},
		},
		description: 'Custom attributes to set on the person. Each Personio instance has unique attribute IDs.',
		options: [
			{
				name: 'attributes',
				displayName: 'Attribute',
				values: [
					{
						displayName: 'Attribute ID',
						name: 'id',
						type: 'string',
						default: '',
						required: true,
						description: 'The custom attribute ID (e.g. "laptop_serial_number" or "dynamic_12345")',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						required: true,
						description: 'The value — for multi-value/tags use a JSON array like ["mouse","keyboard","monitor"]',
					},
				],
			},
		],
		routing: {
			send: {
				type: 'body',
				property: '_customAttributes',
				preSend: [
					async function (
						this: IExecuteSingleFunctions,
						requestOptions: IHttpRequestOptions,
					): Promise<IHttpRequestOptions> {
						const body = requestOptions.body as Record<string, unknown>;
						const customAttrsParam = this.getNodeParameter('customAttributes', {}) as {
							attributes?: Array<{ id: string; value: string }>;
						};
						const rows = customAttrsParam.attributes ?? [];

						if (rows.length > 0) {
							body.custom_attributes = rows.map((row) => {
								let parsedValue: string | string[];
								try {
									const parsed = JSON.parse(row.value);
									if (Array.isArray(parsed)) {
										parsedValue = parsed;
									} else {
										parsedValue = row.value;
									}
								} catch {
									parsedValue = row.value;
								}
								return { id: row.id, value: parsedValue };
							});
						}

						delete body._customAttributes;
						requestOptions.body = body;
						return requestOptions;
					},
				],
			},
		},
	},

	// ----------------------------------
	//         person: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['person'],
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
			maxValue: 50,
		},
		displayOptions: {
			show: {
				resource: ['person'],
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
				resource: ['person'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'query',
						property: 'email',
					},
				},
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'query',
						property: 'first_name',
					},
				},
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'query',
						property: 'last_name',
					},
				},
			},
			{
				displayName: 'Updated Since',
				name: 'updatedAtGt',
				type: 'dateTime',
				default: '',
				description: 'Return persons updated after this date',
				routing: {
					send: {
						type: 'query',
						property: 'updated_at.gt',
					},
				},
			},
		],
	},
];
