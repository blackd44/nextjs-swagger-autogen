# Next.js Swagger Auto-Generator

Auto-generate Swagger/OpenAPI documentation for your Next.js API routes with zero configuration.

## Features

- 🚀 **Zero Configuration** - Works out of the box with Next.js App Router
- 📝 **Auto-Discovery** - Automatically finds and documents your API routes
- 🎨 **Customizable** - Flexible configuration options
- 🔍 **Method Detection** - Automatically detects HTTP methods from your route files
- 📊 **Dynamic Parameters** - Supports Next.js dynamic routes `[id]` and catch-all `[...slug]`
- 🎯 **TypeScript Support** - Fully typed with TypeScript
- 🎪 **Interactive UI** - Beautiful Swagger UI interface

## Installation

```bash
npm install nextjs-swagger-autogen
# or
yarn add nextjs-swagger-autogen
# or
pnpm add nextjs-swagger-autogen
```

## Quick Start

### 1. Create a Swagger documentation page

Create a new page at `src/app/api-docs/page.tsx`:

```tsx
import { createSwaggerPage } from "nextjs-swagger-autogen";
import "swagger-ui-react/swagger-ui.css";

// Simple usage with defaults
export default createSwaggerPage();
```

### 2. Custom configuration

```tsx
import { createSwaggerPage } from "nextjs-swagger-autogen";
import "swagger-ui-react/swagger-ui.css";

export default createSwaggerPage({
  config: {
    info: {
      title: "My API Documentation",
      version: "2.0.0",
      description: "API documentation for my awesome app",
    },
    servers: [
      { url: "http://localhost:3000/api", description: "Development" },
      { url: "https://myapp.com/api", description: "Production" },
    ],
  },
  includeMethods: ["GET", "POST", "PUT", "DELETE"],
  excludePaths: ["/internal", "/admin"],
});
```

### 3. Manual usage

```tsx
import { generateOpenApiSpec, ReactSwagger } from "nextjs-swagger-autogen";
import "swagger-ui-react/swagger-ui.css";

export default function ApiDocsPage() {
  const spec = generateOpenApiSpec({
    apiPath: "src/app/api", // Custom API path
    config: {
      info: {
        title: "Custom API",
        version: "1.0.0",
      },
    },
  });

  return (
    <div className="min-h-screen">
      <ReactSwagger spec={spec} />
    </div>
  );
}
```

## API Reference

### `generateOpenApiSpec(options)`

Generates an OpenAPI specification from your Next.js API routes.

#### Options

| Option           | Type                     | Default                                     | Description                         |
| ---------------- | ------------------------ | ------------------------------------------- | ----------------------------------- |
| `apiPath`        | `string`                 | `src/app/api`                               | Path to your API routes directory   |
| `config`         | `Partial<SwaggerConfig>` | Default config                              | Custom OpenAPI configuration        |
| `includeMethods` | `Array<HTTPMethod>`      | `['GET', 'POST', 'PUT', 'DELETE', 'PATCH']` | HTTP methods to include             |
| `excludePaths`   | `string[]`               | `[]`                                        | Paths to exclude from documentation |
| `customPaths`    | `Record<string, any>`    | `{}`                                        | Custom path definitions to add      |

### `createSwaggerPage(options)`

Creates a React component that renders your API documentation.

#### Options

Extends `generateOpenApiSpec` options plus:

| Option           | Type                  | Default                                             | Description                     |
| ---------------- | --------------------- | --------------------------------------------------- | ------------------------------- |
| `className`      | `string`              | `undefined`                                         | CSS class for the container     |
| `containerStyle` | `React.CSSProperties` | `{ minHeight: "100dvh", backgroundColor: "white" }` | Inline styles for the container |

### `ReactSwagger`

A React component that renders the Swagger UI.

#### Props

| Prop              | Type                         | Default  | Description                       |
| ----------------- | ---------------------------- | -------- | --------------------------------- |
| `spec`            | `OpenApiSpec`                | Required | The OpenAPI specification         |
| `docExpansion`    | `'list' \| 'full' \| 'none'` | `'list'` | Default expansion depth           |
| `tryItOutEnabled` | `boolean`                    | `true`   | Enable "Try it out" functionality |
| `filter`          | `boolean \| string`          | `false`  | Enable filtering                  |

### `SwaggerErrorBoundary`

Error boundary component for handling Swagger UI errors.

#### Props

| Prop       | Type        | Default          | Description                     |
| ---------- | ----------- | ---------------- | ------------------------------- |
| `children` | `ReactNode` | Required         | Child components to wrap        |
| `fallback` | `ReactNode` | Default error UI | Custom error fallback component |

## File Structure Support

The package works with the standard Next.js App Router structure:

```
src/app/api/
├── users/
│   ├── route.ts          # /api/users
│   └── [id]/
│       └── route.ts      # /api/users/[id]
├── posts/
│   ├── route.ts          # /api/posts
│   └── [...slug]/
│       └── route.ts      # /api/posts/[...slug]
└── health/
    └── route.ts          # /api/health
```

## Method Detection

The package automatically detects HTTP methods by looking for exported functions:

```typescript
// route.ts
export async function GET() {
  return Response.json({ message: "Hello World" });
}

export async function POST(request: Request) {
  const body = await request.json();
  return Response.json({ received: body });
}

export async function PUT(request: Request) {
  // PUT handler
}
```

## Dynamic Routes

Dynamic routes are automatically converted to OpenAPI parameters:

- `[id]` → Path parameter `id`
- `[...slug]` → Optional path parameter `slug`
- `[[...optional]]` → Optional catch-all parameter

## Configuration Examples

### Production Setup

```tsx
import { createSwaggerPage } from "nextjs-swagger-autogen";
import "swagger-ui-react/swagger-ui.css";

export default createSwaggerPage({
  config: {
    info: {
      title: "Production API",
      version: "1.0.0",
      description: "Production API documentation",
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_API_URL || "https://api.myapp.com",
        description: "Production server",
      },
    ],
  },
  excludePaths: ["/internal", "/admin", "/debug"],
  includeMethods: ["GET", "POST", "PUT", "DELETE"],
});
```

### Custom Styling

```tsx
import { createSwaggerPage } from "nextjs-swagger-autogen";
import "swagger-ui-react/swagger-ui.css";

export default createSwaggerPage({
  className: "min-h-screen bg-gray-50 dark:bg-gray-900",
  containerStyle: {
    padding: "2rem",
    maxWidth: "1200px",
    margin: "0 auto",
  },
});
```

### Development vs Production

```tsx
import { createSwaggerPage } from "nextjs-swagger-autogen";

export default createSwaggerPage({
  config: {
    info: {
      title:
        process.env.NODE_ENV === "production"
          ? "Production API"
          : "Development API",
      version: "1.0.0",
    },
    servers:
      process.env.NODE_ENV === "production"
        ? [{ url: "https://api.myapp.com", description: "Production" }]
        : [{ url: "http://localhost:3000/api", description: "Development" }],
  },
  suppressConsoleWarnings: process.env.NODE_ENV === "production",
});
```

## License

MIT

## Contributing

Contributions are welcome! Please read our contributing guide and submit pull requests to our repository.

## Support

If you encounter any issues, please file them in the [GitHub Issues](https://github.com/blackd44/nextjs-swagger-autogen/issues) section.
