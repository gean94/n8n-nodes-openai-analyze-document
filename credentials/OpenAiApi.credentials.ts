import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class OpenAiApi implements ICredentialType {
    name = 'openAiApi';
    displayName = 'OpenAI API';
    documentationUrl = 'https://platform.openai.com/docs/api-reference';
    properties: INodeProperties[] = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
}
