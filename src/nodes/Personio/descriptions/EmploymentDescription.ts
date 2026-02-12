import type { INodeProperties, IHttpRequestOptions } from 'n8n-workflow';
import type { IExecuteSingleFunctions } from 'n8n-workflow';

export const employmentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['employment'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get an employment record',
				action: 'Get an employment',
				routing: {
					request: {
						method: 'GET',
						url: '=/v2/persons/{{$parameter.personId}}/employments/{{$parameter.employmentId}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get all employments for a person',
				action: 'Get many employments',
				routing: {
					request: {
						method: 'GET',
						url: '=/v2/persons/{{$parameter.personId}}/employments',
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
				},
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an employment record',
				action: 'Update an employment',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/v2/persons/{{$parameter.personId}}/employments/{{$parameter.employmentId}}',
					},
				},
			},
		],
		default: 'getAll',
	},
];

export const employmentFields: INodeProperties[] = [
	// ----------------------------------
	//         employment: shared
	// ----------------------------------
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['employment'],
			},
		},
		description: 'The ID of the person',
	},
	{
		displayName: 'Employment ID',
		name: 'employmentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['employment'],
				operation: ['get', 'update'],
			},
		},
		description: 'The ID of the employment record',
	},

	// ----------------------------------
	//         employment: update — required fields
	// ----------------------------------
	{
		displayName: 'Status',
		name: 'status',
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
				resource: ['employment'],
				operation: ['update'],
			},
		},
		description: 'Employment status (required by Personio)',
		routing: {
			send: {
				type: 'body',
				property: 'status',
			},
		},
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
				resource: ['employment'],
				operation: ['update'],
			},
		},
		description: 'The start date of the employment (required by Personio)',
		routing: {
			send: {
				type: 'body',
				property: 'employment_start_date',
			},
		},
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
				resource: ['employment'],
				operation: ['update'],
			},
		},
		description: 'Whether the employee is internal or external (required by Personio)',
		routing: {
			send: {
				type: 'body',
				property: 'type',
			},
		},
	},

	// ----------------------------------
	//         employment: update — optional fields
	//         Uses preSend hook for nested objects
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['employment'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Contract End Date',
				name: 'contractEndDate',
				type: 'string',
				default: '',
				placeholder: 'YYYY-MM-DD',
				description: 'End date of the contract (YYYY-MM-DD)',
			},
			{
				displayName: 'Cost Center IDs',
				name: 'costCenterIds',
				type: 'string',
				default: '',
				placeholder: '653',
				description: 'Comma-separated cost center IDs (weights auto-distributed equally, first gets remainder)',
			},
			{
				displayName: 'Department ID',
				name: 'departmentId',
				type: 'string',
				default: '',
				description: 'ID of the department (org unit)',
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
				displayName: 'Legal Entity ID',
				name: 'legalEntityId',
				type: 'string',
				default: '',
				description: 'ID of the legal entity',
			},
			{
				displayName: 'Office ID',
				name: 'officeId',
				type: 'string',
				default: '',
				description: 'ID of the office location',
			},
			{
				displayName: 'Position Title',
				name: 'position',
				type: 'string',
				default: '',
				description: 'Job title (e.g. "Senior Account Manager")',
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
				displayName: 'Supervisor ID',
				name: 'supervisorId',
				type: 'string',
				default: '',
				description: 'Person ID of the supervisor / manager',
			},
			{
				displayName: 'Team ID',
				name: 'teamId',
				type: 'string',
				default: '',
				description: 'ID of the team (org unit)',
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
		],
		routing: {
			send: {
				type: 'body',
				property: '_buildEmploymentUpdate',
				preSend: [
					async function (
						this: IExecuteSingleFunctions,
						requestOptions: IHttpRequestOptions,
					): Promise<IHttpRequestOptions> {
						const body = requestOptions.body as Record<string, unknown>;
						const updateFields = this.getNodeParameter('updateFields', {}) as Record<string, unknown>;

						// Simple fields
						if (updateFields.contractEndDate) {
							body.contract_end_date = updateFields.contractEndDate;
						}
						if (updateFields.probationEndDate) {
							body.probation_end_date = updateFields.probationEndDate;
						}
						if (updateFields.probationPeriodLength !== undefined && updateFields.probationPeriodLength !== '') {
							body.probation_period_length = updateFields.probationPeriodLength;
						}
						if (updateFields.weeklyWorkingHours !== undefined && updateFields.weeklyWorkingHours !== '') {
							body.weekly_working_hours = updateFields.weeklyWorkingHours;
						}
						if (updateFields.fullTimeWeeklyWorkingHours !== undefined && updateFields.fullTimeWeeklyWorkingHours !== '') {
							body.full_time_weekly_working_hours = updateFields.fullTimeWeeklyWorkingHours;
						}

						// Nested object fields
						if (updateFields.position) {
							body.position = { title: updateFields.position as string };
						}
						if (updateFields.supervisorId) {
							body.supervisor = { id: String(updateFields.supervisorId) };
						}
						if (updateFields.officeId) {
							body.office = { id: String(updateFields.officeId) };
						}
						if (updateFields.legalEntityId) {
							body.legal_entity = { id: String(updateFields.legalEntityId) };
						}

						// Org units (department + team)
						const orgUnits: Array<Record<string, string>> = [];
						if (updateFields.departmentId) {
							orgUnits.push({ type: 'department', id: String(updateFields.departmentId) });
						}
						if (updateFields.teamId) {
							orgUnits.push({ type: 'team', id: String(updateFields.teamId) });
						}
						if (orgUnits.length > 0) {
							body.org_units = orgUnits;
						}

						// Cost centers
						if (updateFields.costCenterIds) {
							const ids = (updateFields.costCenterIds as string)
								.split(',')
								.map((id: string) => id.trim())
								.filter((id: string) => id);
							if (ids.length > 0) {
								const weight = Math.floor(100 / ids.length);
								const remainder = 100 - weight * ids.length;
								body.cost_centers = ids.map((id: string, index: number) => ({
									id,
									weight: index === 0 ? weight + remainder : weight,
								}));
							}
						}

						// Clean up temp property
						delete body._buildEmploymentUpdate;

						requestOptions.body = body;
						return requestOptions;
					},
				],
			},
		},
	},
];
