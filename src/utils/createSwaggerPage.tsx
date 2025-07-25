import { SwaggerClient } from "../components/SwaggerClient";
import { generateOpenApiSpec } from "../lib/swagger";
import { SwaggerOptions } from "../types";

interface CreateSwaggerPageOptions extends SwaggerOptions {
  className?: string;
  containerStyle?: React.CSSProperties;
  suppressConsoleWarnings?: boolean;
}

export function createSwaggerPage(options: CreateSwaggerPageOptions = {}) {
  const {
    className,
    containerStyle,
    suppressConsoleWarnings,
    ...swaggerOptions
  } = options;

  const SwaggerPage: React.FC = () => {
    const spec = generateOpenApiSpec(swaggerOptions);

    return (
      <SwaggerClient
        spec={spec}
        className={className}
        containerStyle={containerStyle}
        suppressConsoleWarnings={suppressConsoleWarnings}
      />
    );
  };

  SwaggerPage.displayName = "SwaggerPage";

  return SwaggerPage;
}
