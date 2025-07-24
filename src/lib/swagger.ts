import fs from "fs";
import path from "path";
import { SwaggerOptions, OpenApiSpec, SwaggerConfig } from "../types";

const defaultConfig: SwaggerConfig = {
  openapi: "3.0.0",
  info: {
    title: "Next.js API Documentation",
    version: "1.0.0",
    description: "Auto-generated Swagger documentation for Next.js API routes",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Development server",
    },
  ],
};

const defaultMethods = ["GET", "POST", "PUT", "DELETE", "PATCH"] as const;

export function generateOpenApiSpec(options: SwaggerOptions = {}): OpenApiSpec {
  const {
    apiPath = path.join(process.cwd(), "src/app/api"),
    config = {},
    includeMethods = defaultMethods,
    excludePaths = [],
    customPaths = {},
  } = options;

  const mergedConfig = {
    ...defaultConfig,
    ...config,
    info: {
      ...defaultConfig.info,
      ...config.info,
    },
    servers: config.servers || defaultConfig.servers,
  };

  const paths: Record<string, any> = { ...customPaths };

  function extractMethodsFromFile(filePath: string): string[] {
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const methods: string[] = [];

      // Look for exported functions that match HTTP methods
      const methodRegex =
        /export\s+(?:async\s+)?function\s+(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)\s*\(/g;
      let match;

      while ((match = methodRegex.exec(content)) !== null) {
        if (includeMethods.includes(match[1] as any)) {
          methods.push(match[1]);
        }
      }

      return methods;
    } catch (error) {
      console.warn(`Could not read file ${filePath}:`, error);
      return [];
    }
  }

  function generateMethodSpec(method: string, urlPath: string) {
    const methodLower = method.toLowerCase();

    return {
      [methodLower]: {
        summary: `${method} ${urlPath}`,
        description: `${method} endpoint for ${urlPath}`,
        tags: [getTagFromPath(urlPath)],
        parameters: extractDynamicParams(urlPath),
        responses: {
          200: {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    data: {
                      type: "object",
                      description: "Response data",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "string",
                      example: "Invalid request parameters",
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "string",
                      example: "Internal server error",
                    },
                  },
                },
              },
            },
          },
        },
      },
    };
  }

  function getTagFromPath(urlPath: string): string {
    const segments = urlPath.split("/").filter(Boolean);
    return segments[0] || "default";
  }

  function extractDynamicParams(urlPath: string) {
    const params: any[] = [];
    const dynamicSegments = urlPath.match(/\[([^\]]+)\]/g);

    if (dynamicSegments) {
      dynamicSegments.forEach((segment) => {
        const paramName = segment.replace(/[\[\]]/g, "");
        const isOptional = paramName.includes("...");
        const cleanName = paramName.replace("...", "");

        params.push({
          name: cleanName,
          in: "path",
          required: !isOptional,
          schema: {
            type: "string",
          },
          description: `Dynamic path parameter: ${cleanName}`,
        });
      });
    }

    return params;
  }

  function walk(dir: string, parentRoute: string = "") {
    if (!fs.existsSync(dir)) {
      console.warn(`API directory not found: ${dir}`);
      return;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath, path.join(parentRoute, entry.name));
      } else if (entry.name === "route.ts" || entry.name === "route.js") {
        let urlPath =
          parentRoute.replace(/\/route$/, "").replace(/\/$/, "") || "/";
        if (!urlPath.startsWith("/")) {
          urlPath = "/" + urlPath;
        }

        // Skip excluded paths
        if (excludePaths.some((excluded) => urlPath.includes(excluded))) {
          continue;
        }

        // Extract methods from the route file
        const methods = extractMethodsFromFile(fullPath);

        if (methods.length > 0) {
          paths[urlPath] = {};
          methods.forEach((method) => {
            const methodSpec = generateMethodSpec(method, urlPath);
            Object.assign(paths[urlPath], methodSpec);
          });
        } else {
          // Fallback: assume GET method if no methods found
          const methodSpec = generateMethodSpec("GET", urlPath);
          paths[urlPath] = methodSpec;
        }
      }
    }
  }

  walk(apiPath);

  return {
    ...mergedConfig,
    paths,
  };
}
