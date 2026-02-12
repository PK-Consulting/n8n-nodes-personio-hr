"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.organizationFields = exports.organizationOperations = void 0;
exports.organizationOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['organization'],
            },
        },
        options: [
            {
                name: 'Get Legal Entities',
                value: 'getLegalEntities',
                description: 'Get all legal entities',
                action: 'Get legal entities',
                routing: {
                    request: {
                        method: 'GET',
                        url: '/v2/legal-entities',
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
                name: 'Get Legal Entity',
                value: 'getLegalEntity',
                description: 'Get a legal entity by ID',
                action: 'Get a legal entity',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/v2/legal-entities/{{$parameter.legalEntityId}}',
                    },
                },
            },
        ],
        default: 'getLegalEntities',
    },
];
exports.organizationFields = [
    // ----------------------------------
    //         organization: getLegalEntity
    // ----------------------------------
    {
        displayName: 'Legal Entity ID',
        name: 'legalEntityId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['organization'],
                operation: ['getLegalEntity'],
            },
        },
        description: 'The ID of the legal entity',
    },
    // ----------------------------------
    //         organization: getLegalEntities
    // ----------------------------------
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        displayOptions: {
            show: {
                resource: ['organization'],
                operation: ['getLegalEntities'],
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
                resource: ['organization'],
                operation: ['getLegalEntities'],
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
                resource: ['organization'],
                operation: ['getLegalEntities'],
            },
        },
        options: [
            {
                displayName: 'Country',
                name: 'country',
                type: 'string',
                default: '',
                placeholder: 'DE',
                description: 'ISO 3166 alpha-2 country code',
                routing: {
                    send: {
                        type: 'query',
                        property: 'country',
                    },
                },
            },
        ],
    },
];
//# sourceMappingURL=OrganizationDescription.js.map