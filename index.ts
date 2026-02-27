import { OpenAiApi } from './credentials/OpenAiApi.credentials';
import { OpenAiDocument } from './nodes/OpenAiDocument/OpenAiDocument.node';

export const nodes = [OpenAiDocument];
export const credentials = [OpenAiApi];
