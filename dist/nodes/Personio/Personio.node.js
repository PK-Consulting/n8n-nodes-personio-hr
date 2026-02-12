"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Personio = void 0;
const PersonDescription_1 = require("./descriptions/PersonDescription");
const EmploymentDescription_1 = require("./descriptions/EmploymentDescription");
const AbsencePeriodDescription_1 = require("./descriptions/AbsencePeriodDescription");
const AbsenceTypeDescription_1 = require("./descriptions/AbsenceTypeDescription");
const AttendancePeriodDescription_1 = require("./descriptions/AttendancePeriodDescription");
const ProjectDescription_1 = require("./descriptions/ProjectDescription");
const DocumentDescription_1 = require("./descriptions/DocumentDescription");
const CompensationDescription_1 = require("./descriptions/CompensationDescription");
const OrganizationDescription_1 = require("./descriptions/OrganizationDescription");
class Personio {
    description = {
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
            ...PersonDescription_1.personOperations,
            ...PersonDescription_1.personFields,
            ...EmploymentDescription_1.employmentOperations,
            ...EmploymentDescription_1.employmentFields,
            ...AbsencePeriodDescription_1.absencePeriodOperations,
            ...AbsencePeriodDescription_1.absencePeriodFields,
            ...AbsenceTypeDescription_1.absenceTypeOperations,
            ...AbsenceTypeDescription_1.absenceTypeFields,
            ...AttendancePeriodDescription_1.attendancePeriodOperations,
            ...AttendancePeriodDescription_1.attendancePeriodFields,
            ...ProjectDescription_1.projectOperations,
            ...ProjectDescription_1.projectFields,
            ...DocumentDescription_1.documentOperations,
            ...DocumentDescription_1.documentFields,
            ...CompensationDescription_1.compensationOperations,
            ...CompensationDescription_1.compensationFields,
            ...OrganizationDescription_1.organizationOperations,
            ...OrganizationDescription_1.organizationFields,
        ],
    };
}
exports.Personio = Personio;
//# sourceMappingURL=Personio.node.js.map