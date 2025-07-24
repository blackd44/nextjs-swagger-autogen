import React from "react";
import { generateOpenApiSpec } from "../lib/swagger";
import { ReactSwagger } from "../components/ReactSwagger";
import { SwaggerOptions } from "../types";

interface CreateSwaggerPageOptions extends SwaggerOptions {
  className?: string;
  containerStyle?: React.CSSProperties;
}

export function createSwaggerPage(options: CreateSwaggerPageOptions = {}) {
  const {
    className = "min-h-screen bg-white",
    containerStyle,
    ...swaggerOptions
  } = options;

  const SwaggerPage: React.FC = () => {
    const spec = generateOpenApiSpec(swaggerOptions);

    return (
      <section className={className} style={containerStyle}>
        <ReactSwagger spec={spec} />
      </section>
    );
  };

  SwaggerPage.displayName = "SwaggerPage";

  return SwaggerPage;
}
