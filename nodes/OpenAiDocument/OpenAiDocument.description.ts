import { INodeTypeDescription } from 'n8n-workflow';

export const description: INodeTypeDescription = {
    displayName: 'OpenAI Document AI - GS',
    name: 'openAiDocumentGs',
    icon: 'file:icons/openai.svg',
    group: ['transform'],
    version: 1,
    description: 'Analyze PDF documents using OpenAI Vision models',
    defaults: {
        name: 'OpenAI Document AI - GS',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
        {
            name: 'openAiApiGs',
            required: true,
        },
    ],
    properties: [
        {
            displayName: 'Operation',
            name: 'operation',
            type: 'options',
            noDataExpression: true,
            options: [
                {
                    name: 'Analyze PDF',
                    value: 'analyzePdf',
                    description: 'Analyze a PDF document',
                    action: 'Analyze a PDF',
                },
            ],
            default: 'analyzePdf',
        },
        {
            displayName: 'Model',
            name: 'model',
            type: 'options',
            typeOptions: {
                loadOptionsMethod: 'getModels',
            },
            default: '',
            required: true,
            description: 'The OpenAI model to use. GPT-4o or GPT-4o-mini are recommended for vision tasks.',
        },
        {
            displayName: 'User Prompt',
            name: 'userPrompt',
            type: 'string',
            typeOptions: {
                rows: 4,
            },
            default: '',
            description: 'Specific instructions for the AI on what to extract from the PDF',
        },
        {
            displayName: 'Input Type',
            name: 'inputType',
            type: 'options',
            options: [
                {
                    name: 'Binary',
                    value: 'binary',
                },
                {
                    name: 'URL',
                    value: 'url',
                },
                {
                    name: 'Base64 (PDF)',
                    value: 'text',
                },
            ],
            default: 'binary',
        },
        {
            displayName: 'Input Data Field Name',
            name: 'binaryPropertyName',
            type: 'string',
            default: 'data',
            displayOptions: {
                show: {
                    inputType: ['binary'],
                },
            },
            description: 'Name of the binary property that contains the PDF file',
        },
        {
            displayName: 'URL',
            name: 'url',
            type: 'string',
            default: '',
            displayOptions: {
                show: {
                    inputType: ['url'],
                },
            },
            description: 'URL of the PDF to analyze',
        },
        {
            displayName: 'Base64 Data',
            name: 'base64Data',
            type: 'string',
            default: '',
            displayOptions: {
                show: {
                    inputType: ['text'],
                },
            },
            description: 'Base64 encoded string of the PDF',
        },
    ],
};
