"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.absencePeriodFields = exports.absencePeriodOperations = void 0;
exports.absencePeriodOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['absencePeriod'],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create an absence period',
                action: 'Create an absence period',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/v2/absence-periods',
                    },
                },
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete an absence period',
                action: 'Delete an absence period',
                routing: {
                    request: {
                        method: 'DELETE',
                        url: '=/v2/absence-periods/{{$parameter.absencePeriodId}}',
                    },
                },
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get an absence period by ID',
                action: 'Get an absence period',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/v2/absence-periods/{{$parameter.absencePeriodId}}',
                    },
                },
            },
            {
                name: 'Get Breakdowns',
                value: 'getBreakdowns',
                description: 'Get daily breakdowns for an absence period',
                action: 'Get absence period breakdowns',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/v2/absence-periods/{{$parameter.absencePeriodId}}/breakdowns',
                    },
                },
            },
            {
                name: 'Get Many',
                value: 'getAll',
                description: 'Get many absence periods',
                action: 'Get many absence periods',
                routing: {
                    request: {
                        method: 'GET',
                        url: '/v2/absence-periods',
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
                description: 'Update an absence period',
                action: 'Update an absence period',
                routing: {
                    request: {
                        method: 'PATCH',
                        url: '=/v2/absence-periods/{{$parameter.absencePeriodId}}',
                    },
                },
            },
        ],
        default: 'getAll',
    },
];
exports.absencePeriodFields = [
    // ----------------------------------
    //         absencePeriod: shared
    // ----------------------------------
    {
        displayName: 'Absence Period ID',
        name: 'absencePeriodId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['absencePeriod'],
                operation: ['get', 'getBreakdowns', 'update', 'delete'],
            },
        },
        description: 'The ID of the absence period',
    },
    // ----------------------------------
    //         absencePeriod: create
    // ----------------------------------
    {
        displayName: 'Person ID',
        name: 'personId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['absencePeriod'],
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
        displayName: 'Absence Type ID',
        name: 'absenceTypeId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['absencePeriod'],
                operation: ['create'],
            },
        },
        description: 'The ID of the absence type (use Absence Type → Get Many to find IDs)',
        routing: {
            send: {
                type: 'body',
                property: 'absence_type.id',
            },
        },
    },
    {
        displayName: 'Start Date',
        name: 'startDate',
        type: 'string',
        required: true,
        default: '',
        placeholder: 'YYYY-MM-DDTHH:MM:SS',
        displayOptions: {
            show: {
                resource: ['absencePeriod'],
                operation: ['create'],
            },
        },
        description: 'Start date/time of the absence (e.g. 2025-03-01T00:00:00). Local time, no timezone offset.',
        routing: {
            send: {
                type: 'body',
                property: 'starts_from.date_time',
            },
        },
    },
    {
        displayName: 'Start Half Day',
        name: 'startHalfDay',
        type: 'options',
        required: true,
        default: 'FIRST_HALF',
        displayOptions: {
            show: {
                resource: ['absencePeriod'],
                operation: ['create'],
            },
        },
        options: [
            {
                name: 'First Half (use for full day start)',
                value: 'FIRST_HALF',
            },
            {
                name: 'Second Half',
                value: 'SECOND_HALF',
            },
        ],
        description: 'FIRST_HALF = absence starts from the beginning of the day (use for full days). SECOND_HALF = absence starts at midday.',
        routing: {
            send: {
                type: 'body',
                property: 'starts_from.type',
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
                resource: ['absencePeriod'],
                operation: ['create'],
            },
        },
        options: [
            {
                displayName: 'Comment',
                name: 'comment',
                type: 'string',
                default: '',
                description: 'Comment for the absence (max 2000 chars)',
                routing: {
                    send: {
                        type: 'body',
                        property: 'comment',
                    },
                },
            },
            {
                displayName: 'End Date',
                name: 'endDate',
                type: 'string',
                default: '',
                placeholder: 'YYYY-MM-DDTHH:MM:SS',
                description: 'End date/time of the absence (e.g. 2025-03-05T00:00:00). Leave empty for open-ended.',
                routing: {
                    send: {
                        type: 'body',
                        property: 'ends_at.date_time',
                    },
                },
            },
            {
                displayName: 'End Half Day',
                name: 'endHalfDay',
                type: 'options',
                default: 'SECOND_HALF',
                options: [
                    {
                        name: 'First Half',
                        value: 'FIRST_HALF',
                    },
                    {
                        name: 'Second Half (use for full day end)',
                        value: 'SECOND_HALF',
                    },
                ],
                description: 'SECOND_HALF = absence lasts until the end of the day (use for full days). FIRST_HALF = absence ends at midday.',
                routing: {
                    send: {
                        type: 'body',
                        property: 'ends_at.type',
                    },
                },
            },
        ],
    },
    // ----------------------------------
    //         absencePeriod: getAll
    // ----------------------------------
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        displayOptions: {
            show: {
                resource: ['absencePeriod'],
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
                resource: ['absencePeriod'],
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
                resource: ['absencePeriod'],
                operation: ['getAll'],
            },
        },
        options: [
            {
                displayName: 'Absence Type ID',
                name: 'absenceTypeId',
                type: 'string',
                default: '',
                routing: {
                    send: {
                        type: 'query',
                        property: 'absence_type.id',
                        propertyInDotNotation: false,
                    },
                },
            },
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
                displayName: 'Starts From (After)',
                name: 'startsFromGte',
                type: 'dateTime',
                default: '',
                routing: {
                    send: {
                        type: 'query',
                        property: 'starts_from.date_time.gte',
                        propertyInDotNotation: false,
                    },
                },
            },
            {
                displayName: 'Starts From (Before)',
                name: 'startsFromLte',
                type: 'dateTime',
                default: '',
                routing: {
                    send: {
                        type: 'query',
                        property: 'starts_from.date_time.lte',
                        propertyInDotNotation: false,
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
    //         absencePeriod: update
    // ----------------------------------
    {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: ['absencePeriod'],
                operation: ['update'],
            },
        },
        options: [
            {
                displayName: 'Comment',
                name: 'comment',
                type: 'string',
                default: '',
                description: 'Comment for the absence (max 2000 chars)',
                routing: {
                    send: {
                        type: 'body',
                        property: 'comment',
                    },
                },
            },
            {
                displayName: 'End Date',
                name: 'endDate',
                type: 'string',
                default: '',
                placeholder: 'YYYY-MM-DDTHH:MM:SS',
                description: 'End date/time of the absence (e.g. 2025-03-05T00:00:00)',
                routing: {
                    send: {
                        type: 'body',
                        property: 'ends_at.date_time',
                    },
                },
            },
            {
                displayName: 'End Half Day',
                name: 'endHalfDay',
                type: 'options',
                default: 'none',
                options: [
                    {
                        name: 'None (Full Day)',
                        value: 'none',
                    },
                    {
                        name: 'First Half',
                        value: 'FIRST_HALF',
                    },
                    {
                        name: 'Second Half',
                        value: 'SECOND_HALF',
                    },
                ],
                description: 'Whether the end date is a half day',
                routing: {
                    send: {
                        type: 'body',
                        property: 'ends_at.type',
                        value: '={{ $value === "none" ? null : $value }}',
                    },
                },
            },
            {
                displayName: 'Start Date',
                name: 'startDate',
                type: 'string',
                default: '',
                placeholder: 'YYYY-MM-DDTHH:MM:SS',
                description: 'Start date/time of the absence (e.g. 2025-03-01T00:00:00)',
                routing: {
                    send: {
                        type: 'body',
                        property: 'starts_from.date_time',
                    },
                },
            },
            {
                displayName: 'Start Half Day',
                name: 'startHalfDay',
                type: 'options',
                default: 'none',
                options: [
                    {
                        name: 'None (Full Day)',
                        value: 'none',
                    },
                    {
                        name: 'First Half',
                        value: 'FIRST_HALF',
                    },
                    {
                        name: 'Second Half',
                        value: 'SECOND_HALF',
                    },
                ],
                description: 'Whether the start date is a half day',
                routing: {
                    send: {
                        type: 'body',
                        property: 'starts_from.type',
                        value: '={{ $value === "none" ? null : $value }}',
                    },
                },
            },
        ],
    },
];
//# sourceMappingURL=AbsencePeriodDescription.js.map