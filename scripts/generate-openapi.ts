#!/usr/bin/env bun

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { load } from 'js-yaml';

interface OpenApiSpec {
  paths: Record<string, Record<string, OpenApiEndpoint>>;
}

interface OpenApiEndpoint {
  tags?: string[];
  summary?: string;
  description?: string;
  parameters?: OpenApiParameter[];
  requestBody?: {
    content?: Record<string, { schema?: { example?: string } }>;
  };
  responses?: Record<string, { description?: string }>;
}

interface OpenApiParameter {
  name: string;
  in: string;
  required?: boolean;
  description?: string;
  example?: string;
  schema?: {
    type?: string;
  };
}

const openApiPath = join(__dirname, '../api-specs/eliza-openapi.yaml');
const outputDir = join(__dirname, '../content/docs/api-reference/endpoints');

// Ensure output directory exists
mkdirSync(outputDir, { recursive: true });

// Read and parse the OpenAPI spec
const spec = load(readFileSync(openApiPath, 'utf8')) as OpenApiSpec;

// Generate index page
const indexContent = `---
title: API Endpoints
description: Complete reference for all ElizaOS REST API endpoints
---

import { Cards, Card } from "fumadocs-ui/components/card";

The ElizaOS REST API provides comprehensive access to agent management, messaging, memory, and more.

## Base URL

\`\`\`
http://localhost:3000
\`\`\`

## Authentication

All API requests require authentication using an API key:

\`\`\`bash
curl -H "apikey: your-api-key" http://localhost:3000/api/agents
\`\`\`

## API Categories

<Cards>
  <Card
    title="Server Health & Status"
    description="Health checks, server status, and logs"
    href="/docs/api-reference/endpoints/server"
  />
  <Card
    title="Agents Management"
    description="Create, manage, and control agents"
    href="/docs/api-reference/endpoints/agents"
  />
  <Card
    title="Messaging System"
    description="Message submission and server management"
    href="/docs/api-reference/endpoints/messaging"
  />
  <Card
    title="Memory Management"
    description="Agent memory operations and search"
    href="/docs/api-reference/endpoints/memory"
  />
  <Card
    title="Audio Processing"
    description="Audio transcription and processing"
    href="/docs/api-reference/endpoints/audio"
  />
  <Card
    title="Media Upload"
    description="File upload and media management"
    href="/docs/api-reference/endpoints/media"
  />
</Cards>

## Quick Reference

### Common Response Codes

| Status Code | Description |
|------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Internal Server Error |

### Request Headers

| Header | Required | Description |
|--------|----------|-------------|
| apikey | Yes | Your API authentication key |
| Content-Type | Yes* | Required for POST/PUT requests (application/json) |

## Environment Variables

Configure your API client with these environment variables:

\`\`\`bash
# API Base URL
ELIZA_API_URL=http://localhost:3000

# API Key
ELIZA_API_KEY=your-api-key-here
\`\`\`

## Rate Limiting

The API implements rate limiting to ensure fair usage:
- 100 requests per minute per API key
- 1000 requests per hour per API key

## Need Help?

- Check the [TypeScript SDK](/docs/api-reference/sdk) for client examples
- View the [Postman Collection](https://github.com/elizaos/eliza/blob/main/eliza.postman.json)
- Join our [Discord](https://discord.gg/elizaos) for support
`;

writeFileSync(join(outputDir, 'index.mdx'), indexContent);

interface EndpointWithPath extends OpenApiEndpoint {
  path: string;
  method: string;
}

// Group endpoints by tag
const endpointsByTag: Record<string, EndpointWithPath[]> = {};

Object.entries(spec.paths).forEach(([path, methods]) => {
  Object.entries(methods).forEach(([method, endpoint]) => {
    const ep = endpoint as OpenApiEndpoint;
    if (ep.tags && ep.tags.length > 0) {
      const tag = ep.tags[0];
      if (!endpointsByTag[tag]) {
        endpointsByTag[tag] = [];
      }
      endpointsByTag[tag].push({
        path,
        method: method.toUpperCase(),
        ...ep
      });
    }
  });
});

// Generate a page for each tag
const tagToFilename: Record<string, string> = {
  'Server Health & Status': 'server',
  'Agents Management': 'agents',
  'Messaging System': 'messaging',
  'Channels & Messages': 'channels',
  'Memory Management': 'memory',
  'Audio Processing': 'audio',
  'Media Upload': 'media',
  'System Configuration': 'system',
  'Static Media Files': 'static'
};

Object.entries(endpointsByTag).forEach(([tag, endpoints]) => {
  const filename = tagToFilename[tag] || tag.toLowerCase().replace(/\s+/g, '-');
  
  let content = `---
title: ${tag}
description: ${tag} endpoints reference
---

import { Tabs, Tab } from "fumadocs-ui/components/tabs";
import { Callout } from "fumadocs-ui/components/callout";

`;

  endpoints.forEach((endpoint) => {
    content += `## ${endpoint.summary || endpoint.method + ' ' + endpoint.path}\n\n`;
    
    if (endpoint.description) {
      content += `${endpoint.description}\n\n`;
    }
    
    content += `### Endpoint\n\n`;
    content += `\`\`\`\n${endpoint.method} ${endpoint.path}\n\`\`\`\n\n`;
    
    // Parameters
    if (endpoint.parameters && endpoint.parameters.length > 0) {
      content += `### Parameters\n\n`;
      content += `| Name | Type | In | Required | Description |\n`;
      content += `|------|------|-----|----------|-------------|\n`;
      
      endpoint.parameters.forEach((param) => {
        content += `| ${param.name} | ${param.schema?.type || 'string'} | ${param.in} | ${param.required ? 'Yes' : 'No'} | ${param.description || param.example || '-'} |\n`;
      });
      content += `\n`;
    }
    
    // Request Body
    if (endpoint.requestBody?.content) {
      content += `### Request Body\n\n`;
      
      Object.entries(endpoint.requestBody.content).forEach(([contentType, schema]) => {
        if (schema.schema?.example) {
          content += `<Tabs items={["Example", "Schema"]}>\n`;
          content += `  <Tab value="Example">\n`;
          content += `    \`\`\`json\n`;
          // Parse and pretty-print JSON
          try {
            const exampleStr = schema.schema.example.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/^"|"$/g, '');
            const exampleObj = JSON.parse(exampleStr);
            content += JSON.stringify(exampleObj, null, 2).split('\n').map(line => `    ${line}`).join('\n') + '\n';
          } catch {
            // If JSON parsing fails, use the original
            content += `    ${schema.schema.example.replace(/\\n/g, '\n').replace(/\\"/g, '"')}\n`;
          }
          content += `    \`\`\`\n`;
          content += `  </Tab>\n`;
          content += `  <Tab value="Schema">\n`;
          content += `    Content-Type: \`${contentType}\`\n`;
          content += `  </Tab>\n`;
          content += `</Tabs>\n\n`;
        }
      });
    }
    
    // Response
    content += `### Response\n\n`;
    if (endpoint.responses?.['200']) {
      content += `**Status Code:** 200 OK\n\n`;
      if (endpoint.responses['200'].description) {
        content += `${endpoint.responses['200'].description}\n\n`;
      }
    }
    
    // Example
    content += `### Example\n\n`;
    content += `<Tabs items={["cURL", "TypeScript", "Python"]}>\n`;
    content += `  <Tab value="cURL">\n`;
    content += `    \`\`\`bash\n`;
    content += `    curl -X ${endpoint.method} \\\n`;
    content += `      -H "apikey: your-api-key" \\\n`;
    if (endpoint.requestBody) {
      content += `      -H "Content-Type: application/json" \\\n`;
      content += `      -d '{"example": "data"}' \\\n`;
    }
    content += `      http://localhost:3000${endpoint.path}\n`;
    content += `    \`\`\`\n`;
    content += `  </Tab>\n`;
    content += `  <Tab value="TypeScript">\n`;
    content += `    \`\`\`typescript\n`;
    content += `    const response = await fetch('http://localhost:3000${endpoint.path}', {\n`;
    content += `      method: '${endpoint.method}',\n`;
    content += `      headers: {\n`;
    content += `        'apikey': 'your-api-key',\n`;
    if (endpoint.requestBody) {
      content += `        'Content-Type': 'application/json',\n`;
    }
    content += `      },\n`;
    if (endpoint.requestBody) {
      content += `      body: JSON.stringify({ example: 'data' }),\n`;
    }
    content += `    });\n`;
    content += `    const data = await response.json();\n`;
    content += `    \`\`\`\n`;
    content += `  </Tab>\n`;
    content += `  <Tab value="Python">\n`;
    content += `    \`\`\`python\n`;
    content += `    import requests\n\n`;
    content += `    response = requests.${endpoint.method.toLowerCase()}(\n`;
    content += `        'http://localhost:3000${endpoint.path}',\n`;
    content += `        headers={'apikey': 'your-api-key'},\n`;
    if (endpoint.requestBody) {
      content += `        json={'example': 'data'}\n`;
    }
    content += `    )\n`;
    content += `    data = response.json()\n`;
    content += `    \`\`\`\n`;
    content += `  </Tab>\n`;
    content += `</Tabs>\n\n`;
    
    content += `---\n\n`;
  });
  
  writeFileSync(join(outputDir, `${filename}.mdx`), content);
});

// Create meta.json for navigation
const metaContent = {
  pages: [
    'index',
    'server',
    'agents',
    'messaging',
    'channels',
    'memory',
    'audio',
    'media',
    'system',
    'static'
  ]
};

writeFileSync(join(outputDir, 'meta.json'), JSON.stringify(metaContent, null, 2));

