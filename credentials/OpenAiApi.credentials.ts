import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class OpenAiApi implements ICredentialType {
    // Use a unique credential name to avoid conflicts with built-in OpenAI creds
    name = 'openAiApiGs';
    displayName = 'OpenAI API (GS)';
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
