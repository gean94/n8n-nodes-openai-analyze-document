import { INodeTypeDescription } from 'n8n-workflow';

export const description: INodeTypeDescription = {
    displayName: 'OpenAI Document AI - GS',
    name: 'openAiDocumentGs',
    icon: 'file:icons/openai.svg',
    group: ['transform'],
    version: 1,
    description: 'Analyze documents using OpenAI Vision models',
    defaults: {
        name: 'OpenAI Document AI - GS',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
        {
            name: 'openAiApi',
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
                    name: 'Analyze Document',
                    value: 'analyzeDocument',
                    description: 'Convert PDF to images and analyze each page',
                    action: 'Analyze a document',
                },
                {
                    name: 'Analyze Image',
                    value: 'analyzeImage',
                    description: 'Analyze an image from binary data, URL or Base64',
                    action: 'Analyze an image',
                },
            ],
            default: 'analyzeDocument',
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
            description: 'Specific instructions for the AI on what to look for in the document/image',
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
                    name: 'Base64 (Text)',
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
            description: 'Name of the binary property that contains the file',
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
            description: 'URL of the image or PDF to analyze',
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
            description: 'Base64 encoded string of the PDF or image',
        },
    ],
};
