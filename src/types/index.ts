export interface SwaggerConfig {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  servers: Array<{
    url: string;
    description?: string;
  }>;
}

export interface SwaggerOptions {
  apiPath?: string;
  config?: Partial<SwaggerConfig>;
  includeMethods?: Array<"GET" | "POST" | "PUT" | "DELETE" | "PATCH">;
  excludePaths?: string[];
  customPaths?: Record<string, any>;
}

export interface OpenApiSpec extends SwaggerConfig {
  paths: Record<string, any>;
}

export interface PathInfo {
  method: string;
  path: string;
  summary?: string;
  description?: string;
  tags?: string[];
  parameters?: any[];
  responses?: Record<string, any>;
}
