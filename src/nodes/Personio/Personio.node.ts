import type { INodeType, INodeTypeDescription } from 'n8n-workflow';

import { personOperations, personFields } from './descriptions/PersonDescription';
import { employmentOperations, employmentFields } from './descriptions/EmploymentDescription';
import {
	absencePeriodOperations,
	absencePeriodFields,
} from './descriptions/AbsencePeriodDescription';
import { absenceTypeOperations, absenceTypeFields } from './descriptions/AbsenceTypeDescription';
import {
	attendancePeriodOperations,
	attendancePeriodFields,
} from './descriptions/AttendancePeriodDescription';
import { projectOperations, projectFields } from './descriptions/ProjectDescription';
import { documentOperations, documentFields } from './descriptions/DocumentDescription';
import { compensationOperations, compensationFields } from './descriptions/CompensationDescription';
import { organizationOperations, organizationFields } from './descriptions/OrganizationDescription';

export class Personio implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Personio HR',
		name: 'personioHr',
		icon: 'file:personio.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Personio HR platform API',
		defaults: {
			name: 'Personio',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'personioApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.personio.de',
			headers: {
				Accept: 'application/json, application/problem+json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Absence Period',
						value: 'absencePeriod',
					},
					{
						name: 'Absence Type',
						value: 'absenceType',
					},
					{
						name: 'Attendance Period',
						value: 'attendancePeriod',
					},
					{
						name: 'Compensation',
						value: 'compensation',
					},
					{
						name: 'Document',
						value: 'document',
					},
					{
						name: 'Employment',
						value: 'employment',
					},
					{
						name: 'Organization',
						value: 'organization',
					},
					{
						name: 'Person',
						value: 'person',
					},
					{
						name: 'Project',
						value: 'project',
					},
				],
				default: 'person',
			},
			// Operations & fields for each resource
			...personOperations,
			...personFields,
			...employmentOperations,
			...employmentFields,
			...absencePeriodOperations,
			...absencePeriodFields,
			...absenceTypeOperations,
			...absenceTypeFields,
			...attendancePeriodOperations,
			...attendancePeriodFields,
			...projectOperations,
			...projectFields,
			...documentOperations,
			...documentFields,
			...compensationOperations,
			...compensationFields,
			...organizationOperations,
			...organizationFields,
		],
	};
}
