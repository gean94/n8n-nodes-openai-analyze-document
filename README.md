# n8n-nodes-openai-analyze-document

Nodo comunitario de n8n para analizar documentos (PDF e imágenes) usando modelos de visión de OpenAI a través del endpoint `responses`. Permite enviar un PDF completo (como archivo binario, URL o Base64) y obtener como salida un objeto JSON con campos clave extraídos.

## Características
- Analiza PDF completo (conversión interna a Base64) o imágenes.
- Carga dinámica de modelos desde OpenAI (requiere API Key).
- Prompt personalizado para guiar la extracción.
- Salida JSON estructurada.

## Requisitos
- Node.js >= 18 y npm >= 9 (para compilar el paquete).
- Una instancia de n8n (local, Docker o nube).
- Una API Key de OpenAI con permisos para usar modelos de visión (p. ej., `gpt-4o` o `gpt-4o-mini`).

## Instalación (en n8n)
1. Abre n8n y ve a: Settings → Community Nodes → Install.
2. Ingresa el nombre del paquete: `n8n-nodes-openai-analyze-document`.
3. Confirma la instalación y reinicia n8n si se solicita.

Alternativa local para desarrollo:
- Clona este repositorio, ejecuta:

```bash
npm install
npm run build
```

- Apunta n8n a tu carpeta compilada `dist/` (o empaqueta y publica en un registro privado si lo deseas).

## Configurar credenciales
- En n8n, crea una credencial de tipo "OpenAI API" y pega tu API Key.
- El nodo usará esta credencial para listar modelos y realizar las solicitudes al endpoint de OpenAI.

## Uso dentro de un flujo
1. Añade el nodo "OpenAI Document AI - GS" a tu flujo.
2. Elige la Operación:
   - Analyze Document: envía un PDF (binario, URL o Base64).
   - Analyze Image: envía una imagen (binario, URL o Base64).
3. Selecciona el `Model` (se carga de OpenAI usando tu API Key). Recomendado: `gpt-4o` o `gpt-4o-mini` para tareas de visión.
4. Escribe el `User Prompt` con instrucciones claras y exige salida en JSON válido exclusivamente con el esquema esperado. Ejemplo de prompt:

```
Extrae los siguientes datos y responde SOLO con JSON válido sin texto adicional:
{
  "cliente": string | null,
  "documento": { "tipo": "DNI" | "RUC" | null, "numero": string | null },
  "monto": number | null,
  "placa": string | null,
  "kilometraje": number | null
}
Si algún dato no está presente, usa null.
```

5. Define el `Input Type` según tu fuente:
   - Binary: indica el nombre del campo binario (por defecto `data`).
   - URL: proporciona un enlace directo a PDF/imagen.
   - Base64 (Text): pega el contenido en Base64 (PDF o imagen).

## Salida
- El nodo devuelve en `items[x].json` el objeto JSON parseado. Si el modelo responde con texto no JSON o formato inválido, el nodo fallará (o devolverá el error en `continueOnFail`).

## Desarrollo
- Compilación: `npm run build` (usa TypeScript y copia íconos a `dist/`).
- Estructura clave:
  - `credentials/OpenAiApi.credentials.ts`: credencial con `apiKey`.
  - `nodes/OpenAiDocument/*`: descripción y lógica del nodo.
  - `index.ts`: punto de entrada del paquete n8n.

## Buenas prácticas para el prompt
- Establece temperatura baja (el nodo usa `temperature: 0`).
- Exige JSON estricto sin explicaciones.
- Incluye el esquema esperado literal en el prompt.
- Maneja ausencias con `null` para evitar formatos ambiguos.

## Limitaciones y notas
- Se envía el archivo al API de OpenAI; valida requisitos de privacidad y cumplimiento.
- El listado de modelos proviene de `GET /v1/models` de OpenAI; tu cuenta debe tener acceso.
- El procesamiento de PDF se hace como `input_file` con Base64; archivos muy grandes pueden fallar por tamaño.

## Licencia
MIT

---

Sugerencias o problemas: abre un issue o envía un PR. ¡Gracias!