"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentFields = exports.documentOperations = void 0;
exports.documentOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['document'],
            },
        },
        options: [
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete a document',
                action: 'Delete a document',
                routing: {
                    request: {
                        method: 'DELETE',
                        url: '=/v2/document-management/documents/{{$parameter.documentId}}',
                    },
                },
            },
            {
                name: 'Download',
                value: 'download',
                description: 'Download a document file',
                action: 'Download a document',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/v2/document-management/documents/{{$parameter.documentId}}/download',
                        encoding: 'arraybuffer',
                        json: false,
                        returnFullResponse: true,
                    },
                    output: {
                        postReceive: [
                            async function (items, responseData) {
                                const binaryData = responseData.body;
                                const headers = responseData.headers;
                                let fileName = 'personio-document';
                                const contentDisposition = headers['content-disposition'];
                                if (contentDisposition) {
                                    const matches = contentDisposition.match(/filename="?([^"]+)"?/);
                                    if (matches)
                                        fileName = matches[1];
                                }
                                const mimeType = headers['content-type'] || 'application/octet-stream';
                                const results = await Promise.all(items.map(async (_item) => {
                                    const binary = await this.helpers.prepareBinaryData(binaryData, fileName, mimeType);
                                    return {
                                        json: {
                                            fileName,
                                            mimeType,
                                        },
                                        binary: {
                                            data: binary,
                                        },
                                    };
                                }));
                                return results;
                            },
                        ],
                    },
                },
            },
            {
                name: 'Get Many',
                value: 'getAll',
                description: 'Get many documents',
                action: 'Get many documents',
                routing: {
                    request: {
                        method: 'GET',
                        url: '/v2/document-management/documents',
                    },
                },
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update document metadata',
                action: 'Update a document',
                routing: {
                    request: {
                        method: 'PATCH',
                        url: '=/v2/document-management/documents/{{$parameter.documentId}}',
                    },
                },
            },
        ],
        default: 'getAll',
    },
];
exports.documentFields = [
    // ----------------------------------
    //         document: shared
    // ----------------------------------
    {
        displayName: 'Document ID',
        name: 'documentId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['download', 'update', 'delete'],
            },
        },
        description: 'The ID of the document',
    },
    // ----------------------------------
    //         document: getAll
    // ----------------------------------
    {
        displayName: 'Owner ID',
        name: 'ownerId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['getAll'],
            },
        },
        description: 'The ID of the document owner (person ID) — required by Personio',
        routing: {
            send: {
                type: 'query',
                property: 'owner_id',
            },
        },
    },
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['getAll'],
            },
        },
        description: 'Whether to return all results or only up to a given limit',
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
                resource: ['document'],
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
                resource: ['document'],
                operation: ['getAll'],
            },
        },
        options: [
            {
                displayName: 'Category ID',
                name: 'categoryId',
                type: 'string',
                default: '',
                routing: {
                    send: {
                        type: 'query',
                        property: 'category_id',
                    },
                },
            },
            {
                displayName: 'Created After',
                name: 'createdAtGte',
                type: 'dateTime',
                default: '',
                routing: {
                    send: {
                        type: 'query',
                        property: 'created_at.gte',
                        propertyInDotNotation: false,
                    },
                },
            },
            {
                displayName: 'Created Before',
                name: 'createdAtLt',
                type: 'dateTime',
                default: '',
                routing: {
                    send: {
                        type: 'query',
                        property: 'created_at.lt',
                        propertyInDotNotation: false,
                    },
                },
            },
        ],
    },
    // ----------------------------------
    //         document: update
    // ----------------------------------
    {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: ['document'],
                operation: ['update'],
            },
        },
        options: [
            {
                displayName: 'Category ID',
                name: 'categoryId',
                type: 'string',
                default: '',
                routing: {
                    send: {
                        type: 'body',
                        property: 'category.id',
                    },
                },
            },
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
                displayName: 'Date',
                name: 'date',
                type: 'string',
                default: '',
                placeholder: 'YYYY-MM-DD',
                description: 'Custom date field for the document',
                routing: {
                    send: {
                        type: 'body',
                        property: 'date',
                    },
                },
            },
            {
                displayName: 'Name',
                name: 'name',
                type: 'string',
                default: '',
                description: 'Document name (max 256 characters)',
                routing: {
                    send: {
                        type: 'body',
                        property: 'name',
                    },
                },
            },
        ],
    },
];
//# sourceMappingURL=DocumentDescription.js.map