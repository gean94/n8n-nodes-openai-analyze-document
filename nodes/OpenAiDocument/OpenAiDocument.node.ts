import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    ILoadOptionsFunctions,
    INodePropertyOptions,
} from 'n8n-workflow';

import { description } from './OpenAiDocument.description';
import { createHash } from 'crypto';
import axios from 'axios';

interface DocumentAnalysisResult {
    cliente: string | null;
    documento: {
        tipo: "DNI" | "RUC" | null;
        numero: string | null;
    };
    monto: number | null;
    placa: string | null;
    kilometraje: number | null;
}

export class OpenAiDocument implements INodeType {
    description: INodeTypeDescription = description;

    methods = {
        loadOptions: {
            async getModels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
                const credentials = await this.getCredentials('openAiApiGs');
                const apiKey = credentials.apiKey as string;

                const response = await axios.get('https://api.openai.com/v1/models', {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                    },
                });

                return response.data.data
                    .map((model: any) => ({
                        name: model.id,
                        value: model.id,
                    }))
                    .sort((a: any, b: any) => a.name.localeCompare(b.name));
            },
        },
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];
        const credentials = await this.getCredentials('openAiApiGs');
        const apiKey = credentials.apiKey as string;

        for (let i = 0; i < items.length; i++) {
            try {
                const model = this.getNodeParameter('model', i) as string;
                const userPrompt = this.getNodeParameter('userPrompt', i) as string;
                const inputType = this.getNodeParameter('inputType', i) as string;

                let fileBuffer: Buffer;
                let filename = "document.pdf";

                // ==========================
                // Obtener y validar PDF
                // ==========================
                if (inputType === 'binary') {
                    const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
                    fileBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
                    const binaryData = items[i].binary?.[binaryPropertyName];
                    if (binaryData?.fileName) {
                        filename = binaryData.fileName;
                    }
                } else if (inputType === 'url') {
                    const url = this.getNodeParameter('url', i) as string;
                    const resp = await axios.get(url, { responseType: 'arraybuffer' });
                    fileBuffer = Buffer.from(resp.data);
                    // Try to infer filename from URL
                    try {
                        const u = new URL(url);
                        const pathname = u.pathname.split('/').pop();
                        if (pathname) filename = pathname;
                    } catch {}
                } else {
                    let base64Data = this.getNodeParameter('base64Data', i) as string;
                    const commaIdx = base64Data.indexOf(',');
                    if (base64Data.startsWith('data:') && commaIdx !== -1) {
                        base64Data = base64Data.slice(commaIdx + 1);
                    }
                    fileBuffer = Buffer.from(base64Data, 'base64');
                }

                // Validate PDF header (%PDF)
                const header = fileBuffer.slice(0, 4).toString('ascii');
                if (header !== '%PDF') {
                    throw new Error('Only PDF files are supported. The provided input is not a valid PDF.');
                }

                const pdfBase64 = fileBuffer.toString('base64');

                // ==========================
                // Generar ID único del documento (MD5 del base64)
                // ==========================
                const documentId = createHash('md5').update(pdfBase64).digest('hex');

                // ==========================
                // Construir Prompt
                // ==========================
                const fullPrompt = `${userPrompt}`;

                const payload = {
                    model: model,
                    input: [
                        {
                            role: "user",
                            content: [
                                {
                                    type: "input_text",
                                    text: fullPrompt
                                },
                                {
                                    type: "input_file",
                                    filename: filename,
                                    file_data: `data:application/pdf;base64,${pdfBase64}`
                                }
                            ]
                        }
                    ],
                    text: {
                        format: { type: "text" }
                    },
                    temperature: 0
                };

                // ==========================
                // Llamada a OpenAI
                // ==========================
                const response = await axios.post(
                    'https://api.openai.com/v1/responses',
                    payload,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${apiKey}`,
                        },
                    }
                );

                const modelText =
                    response.data.output?.[0]?.content?.[0]?.text ?? null;

                if (!modelText) {
                    throw new Error("Model did not return text output");
                }

                let parsed: DocumentAnalysisResult;

                try {
                    parsed = JSON.parse(modelText);
                } catch {
                    throw new Error("Model response is not valid JSON");
                }

                returnData.push({
                    json: {
                        documentId,
                        responseModel: parsed as unknown as { [key: string]: any },
                    },
                });

            } catch (error: any) {
                if (this.continueOnFail()) {
                    returnData.push({ json: { error: error.message } });
                    continue;
                }
                throw error;
            }
        }

        return [returnData];
    }
}