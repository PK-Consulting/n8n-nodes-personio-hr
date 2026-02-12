"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compensationFields = exports.compensationOperations = void 0;
exports.compensationOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['compensation'],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create a compensation',
                action: 'Create a compensation',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/v2/compensations',
                    },
                },
            },
            {
                name: 'Create Type',
                value: 'createType',
                description: 'Create a compensation type',
                action: 'Create a compensation type',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/v2/compensations/types',
                    },
                },
            },
            {
                name: 'Get Many',
                value: 'getAll',
                description: 'Get many compensations',
                action: 'Get many compensations',
                routing: {
                    request: {
                        method: 'GET',
                        url: '/v2/compensations',
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
                name: 'Get Types',
                value: 'getTypes',
                description: 'Get compensation types',
                action: 'Get compensation types',
                routing: {
                    request: {
                        method: 'GET',
                        url: '/v2/compensations/types',
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
        ],
        default: 'getAll',
    },
];
exports.compensationFields = [
    // ----------------------------------
    //         compensation: create
    // ----------------------------------
    {
        displayName: 'Person ID',
        name: 'personId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['compensation'],
                operation: ['create'],
            },
        },
        description: 'The ID of the person',
        routing: {
            send: {
                type: 'body',
                property: 'person.id',
            },
        },
    },
    {
        displayName: 'Compensation Type ID',
        name: 'typeId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['compensation'],
                operation: ['create'],
            },
        },
        description: 'The UUID of the compensation type (use Get Types to find IDs)',
        routing: {
            send: {
                type: 'body',
                property: 'type.id',
            },
        },
    },
    {
        displayName: 'Value',
        name: 'value',
        type: 'number',
        required: true,
        default: 0,
        displayOptions: {
            show: {
                resource: ['compensation'],
                operation: ['create'],
            },
        },
        description: 'Monetary amount (up to 2 decimal places)',
        routing: {
            send: {
                type: 'body',
                property: 'value',
            },
        },
    },
    {
        displayName: 'Effective From',
        name: 'effectiveFrom',
        type: 'string',
        required: true,
        default: '',
        placeholder: 'YYYY-MM-DD',
        displayOptions: {
            show: {
                resource: ['compensation'],
                operation: ['create'],
            },
        },
        description: 'Start date for the compensation (ISO-8601)',
        routing: {
            send: {
                type: 'body',
                property: 'effective_from',
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
                resource: ['compensation'],
                operation: ['create'],
            },
        },
        options: [
            {
                displayName: 'Comment',
                name: 'comment',
                type: 'string',
                default: '',
                routing: {
                    send: {
                        type: 'body',
                        property: 'comment',
                    },
                },
            },
            {
                displayName: 'Currency',
                name: 'currency',
                type: 'string',
                default: '',
                placeholder: 'EUR',
                description: 'ISO-4217 currency code (defaults to company setting)',
                routing: {
                    send: {
                        type: 'body',
                        property: 'currency',
                    },
                },
            },
            {
                displayName: 'Interval',
                name: 'interval',
                type: 'options',
                default: 'MONTHLY',
                options: [
                    { name: 'Monthly', value: 'MONTHLY' },
                    { name: 'Quarterly', value: 'QUARTERLY' },
                    { name: 'Half-Yearly', value: 'HALF-YEARLY' },
                    { name: 'Yearly', value: 'YEARLY' },
                ],
                routing: {
                    send: {
                        type: 'body',
                        property: 'interval',
                    },
                },
            },
        ],
    },
    // ----------------------------------
    //         compensation: createType
    // ----------------------------------
    {
        displayName: 'Type Name',
        name: 'typeName',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['compensation'],
                operation: ['createType'],
            },
        },
        description: 'Name for the compensation type',
        routing: {
            send: {
                type: 'body',
                property: 'name',
            },
        },
    },
    {
        displayName: 'Category',
        name: 'category',
        type: 'options',
        required: true,
        default: 'RECURRING',
        displayOptions: {
            show: {
                resource: ['compensation'],
                operation: ['createType'],
            },
        },
        options: [
            {
                name: 'Recurring',
                value: 'RECURRING',
            },
            {
                name: 'One Time',
                value: 'ONE_TIME',
            },
        ],
        description: 'Category of the compensation type',
        routing: {
            send: {
                type: 'body',
                property: 'category',
            },
        },
    },
    // ----------------------------------
    //         compensation: getAll
    // ----------------------------------
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        displayOptions: {
            show: {
                resource: ['compensation'],
                operation: ['getAll', 'getTypes'],
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
                resource: ['compensation'],
                operation: ['getAll', 'getTypes'],
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
                resource: ['compensation'],
                operation: ['getAll'],
            },
        },
        options: [
            {
                displayName: 'End Date',
                name: 'endDate',
                type: 'string',
                default: '',
                placeholder: 'YYYY-MM-DD',
                description: 'End date for compensation range (max 1 month span)',
                routing: {
                    send: {
                        type: 'query',
                        property: 'end_date',
                    },
                },
            },
            {
                displayName: 'Legal Entity ID',
                name: 'legalEntityId',
                type: 'string',
                default: '',
                routing: {
                    send: {
                        type: 'query',
                        property: 'legal_entity.id',
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
                displayName: 'Start Date',
                name: 'startDate',
                type: 'string',
                default: '',
                placeholder: 'YYYY-MM-DD',
                description: 'Start date for compensation range (max 1 month span)',
                routing: {
                    send: {
                        type: 'query',
                        property: 'start_date',
                    },
                },
            },
        ],
    },
];
//# sourceMappingURL=CompensationDescription.js.map