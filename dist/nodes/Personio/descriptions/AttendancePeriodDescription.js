"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendancePeriodFields = exports.attendancePeriodOperations = void 0;
exports.attendancePeriodOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['attendancePeriod'],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create an attendance period',
                action: 'Create an attendance period',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/v2/attendance-periods',
                    },
                },
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete an attendance period',
                action: 'Delete an attendance period',
                routing: {
                    request: {
                        method: 'DELETE',
                        url: '=/v2/attendance-periods/{{$parameter.attendancePeriodId}}',
                    },
                },
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get an attendance period by ID',
                action: 'Get an attendance period',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/v2/attendance-periods/{{$parameter.attendancePeriodId}}',
                    },
                },
            },
            {
                name: 'Get Many',
                value: 'getAll',
                description: 'Get many attendance periods',
                action: 'Get many attendance periods',
                routing: {
                    request: {
                        method: 'GET',
                        url: '/v2/attendance-periods',
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
                description: 'Update an attendance period',
                action: 'Update an attendance period',
                routing: {
                    request: {
                        method: 'PATCH',
                        url: '=/v2/attendance-periods/{{$parameter.attendancePeriodId}}',
                    },
                },
            },
        ],
        default: 'getAll',
    },
];
exports.attendancePeriodFields = [
    // ----------------------------------
    //         attendancePeriod: shared
    // ----------------------------------
    {
        displayName: 'Attendance Period ID',
        name: 'attendancePeriodId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['attendancePeriod'],
                operation: ['get', 'update', 'delete'],
            },
        },
        description: 'The ID of the attendance period',
    },
    // ----------------------------------
    //         attendancePeriod: create
    // ----------------------------------
    {
        displayName: 'Person ID',
        name: 'personId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['attendancePeriod'],
                operation: ['create'],
            },
        },
        description: 'The numeric ID of the person (employee)',
        routing: {
            send: {
                type: 'body',
                property: 'person.id',
            },
        },
    },
    {
        displayName: 'Type',
        name: 'attendanceType',
        type: 'options',
        required: true,
        default: 'WORK',
        displayOptions: {
            show: {
                resource: ['attendancePeriod'],
                operation: ['create'],
            },
        },
        options: [
            {
                name: 'Work',
                value: 'WORK',
            },
            {
                name: 'Break',
                value: 'BREAK',
            },
        ],
        description: 'The type of attendance period',
        routing: {
            send: {
                type: 'body',
                property: 'type',
            },
        },
    },
    {
        displayName: 'Start Date/Time',
        name: 'startDateTime',
        type: 'string',
        required: true,
        default: '',
        placeholder: 'YYYY-MM-DDTHH:MM:SS',
        displayOptions: {
            show: {
                resource: ['attendancePeriod'],
                operation: ['create'],
            },
        },
        description: 'Start date and time (e.g. 2025-03-01T09:00:00). Local time, no timezone offset.',
        routing: {
            send: {
                type: 'body',
                property: 'start.date_time',
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
                resource: ['attendancePeriod'],
                operation: ['create'],
            },
        },
        options: [
            {
                displayName: 'Comment',
                name: 'comment',
                type: 'string',
                default: '',
                description: 'Comment for the attendance (max 1000 chars)',
                routing: {
                    send: {
                        type: 'body',
                        property: 'comment',
                    },
                },
            },
            {
                displayName: 'End Date/Time',
                name: 'endDateTime',
                type: 'string',
                default: '',
                placeholder: 'YYYY-MM-DDTHH:MM:SS',
                description: 'End date and time (e.g. 2025-03-01T17:00:00). Leave empty for ongoing.',
                routing: {
                    send: {
                        type: 'body',
                        property: 'end.date_time',
                    },
                },
            },
            {
                displayName: 'Project ID',
                name: 'projectId',
                type: 'string',
                default: '',
                description: 'The ID of the associated project (only for WORK type, project must be ACTIVE)',
                routing: {
                    send: {
                        type: 'body',
                        property: 'project.id',
                    },
                },
            },
        ],
    },
    // ----------------------------------
    //         attendancePeriod: getAll
    // ----------------------------------
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        displayOptions: {
            show: {
                resource: ['attendancePeriod'],
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
            maxValue: 100,
        },
        displayOptions: {
            show: {
                resource: ['attendancePeriod'],
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
                resource: ['attendancePeriod'],
                operation: ['getAll'],
            },
        },
        options: [
            {
                displayName: 'Person ID',
                name: 'personId',
                type: 'string',
                default: '',
                routing: {
                    send: {
                        type: 'query',
                        property: 'person.id',
                        propertyInDotNotation: false,
                    },
                },
            },
            {
                displayName: 'Start Date (After)',
                name: 'startDateGte',
                type: 'dateTime',
                default: '',
                routing: {
                    send: {
                        type: 'query',
                        property: 'start.date_time.gte',
                        propertyInDotNotation: false,
                    },
                },
            },
            {
                displayName: 'Start Date (Before)',
                name: 'startDateLte',
                type: 'dateTime',
                default: '',
                routing: {
                    send: {
                        type: 'query',
                        property: 'start.date_time.lte',
                        propertyInDotNotation: false,
                    },
                },
            },
            {
                displayName: 'Status',
                name: 'status',
                type: 'options',
                default: '',
                options: [
                    { name: 'Confirmed', value: 'CONFIRMED' },
                    { name: 'Pending', value: 'PENDING' },
                    { name: 'Rejected', value: 'REJECTED' },
                ],
                routing: {
                    send: {
                        type: 'query',
                        property: 'status',
                    },
                },
            },
            {
                displayName: 'Updated Since',
                name: 'updatedAtGte',
                type: 'dateTime',
                default: '',
                routing: {
                    send: {
                        type: 'query',
                        property: 'updated_at.gte',
                        propertyInDotNotation: false,
                    },
                },
            },
        ],
    },
    // ----------------------------------
    //         attendancePeriod: update
    // ----------------------------------
    {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: ['attendancePeriod'],
                operation: ['update'],
            },
        },
        options: [
            {
                displayName: 'Comment',
                name: 'comment',
                type: 'string',
                default: '',
                description: 'Comment for the attendance (max 1000 chars)',
                routing: {
                    send: {
                        type: 'body',
                        property: 'comment',
                    },
                },
            },
            {
                displayName: 'End Date/Time',
                name: 'endDateTime',
                type: 'string',
                default: '',
                placeholder: 'YYYY-MM-DDTHH:MM:SS',
                description: 'End date and time (e.g. 2025-03-01T17:00:00)',
                routing: {
                    send: {
                        type: 'body',
                        property: 'end.date_time',
                    },
                },
            },
            {
                displayName: 'Project ID',
                name: 'projectId',
                type: 'string',
                default: '',
                description: 'The ID of the associated project (must be ACTIVE)',
                routing: {
                    send: {
                        type: 'body',
                        property: 'project.id',
                    },
                },
            },
            {
                displayName: 'Start Date/Time',
                name: 'startDateTime',
                type: 'string',
                default: '',
                placeholder: 'YYYY-MM-DDTHH:MM:SS',
                description: 'Start date and time (e.g. 2025-03-01T09:00:00)',
                routing: {
                    send: {
                        type: 'body',
                        property: 'start.date_time',
                    },
                },
            },
        ],
    },
];
//# sourceMappingURL=AttendancePeriodDescription.js.map