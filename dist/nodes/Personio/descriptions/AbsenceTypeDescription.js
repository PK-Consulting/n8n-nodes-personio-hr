"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.absenceTypeFields = exports.absenceTypeOperations = void 0;
exports.absenceTypeOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['absenceType'],
            },
        },
        options: [
            {
                name: 'Get',
                value: 'get',
                description: 'Get an absence type by ID',
                action: 'Get an absence type',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/v2/absence-types/{{$parameter.absenceTypeId}}',
                    },
                },
            },
            {
                name: 'Get Many',
                value: 'getAll',
                description: 'Get all absence types',
                action: 'Get many absence types',
                routing: {
                    request: {
                        method: 'GET',
                        url: '/v2/absence-types',
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
exports.absenceTypeFields = [
    {
        displayName: 'Absence Type ID',
        name: 'absenceTypeId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['absenceType'],
                operation: ['get'],
            },
        },
        description: 'The ID of the absence type',
    },
    // ----------------------------------
    //         absenceType: getAll
    // ----------------------------------
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        displayOptions: {
            show: {
                resource: ['absenceType'],
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
                resource: ['absenceType'],
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
];
//# sourceMappingURL=AbsenceTypeDescription.js.map