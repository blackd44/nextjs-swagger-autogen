import React from "react";
import { generateOpenApiSpec } from "../lib/swagger";
import { ReactSwagger } from "../components/ReactSwagger";
import { SwaggerOptions } from "../types";

interface CreateSwaggerPageOptions extends SwaggerOptions {
  className?: string;
  containerStyle?: React.CSSProperties;
}

export function createSwaggerPage(options: CreateSwaggerPageOptions = {}) {
  const { className, containerStyle, ...swaggerOptions } = options;

  const SwaggerPage: React.FC = () => {
    const spec = generateOpenApiSpec(swaggerOptions);

    return (
      <section
        className={className}
        style={{
          minHeight: "100dvh",
          backgroundColor: "white",
          ...containerStyle,
        }}
      >
        <ReactSwagger spec={spec} />
      </section>
    );
  };

  SwaggerPage.displayName = "SwaggerPage";

  return SwaggerPage;
}
