"use client";

import React from "react";
import SwaggerUI from "swagger-ui-react";
import { OpenApiSpec } from "../types";

interface ReactSwaggerProps {
  spec: OpenApiSpec;
  docExpansion?: "list" | "full" | "none";
  defaultModelsExpandDepth?: number;
  defaultModelRendering?: "example" | "model";
  displayOperationId?: boolean;
  displayRequestDuration?: boolean;
  filter?: boolean | string;
  showExtensions?: boolean;
  showCommonExtensions?: boolean;
  tryItOutEnabled?: boolean;
  supportedSubmitMethods?: (
    | "get"
    | "post"
    | "put"
    | "delete"
    | "patch"
    | "options"
    | "head"
    | "trace"
  )[];
  validatorUrl?: string | null;
  withCredentials?: boolean;
  persistAuthorization?: boolean;
  deepLinking?: boolean;
}

export const ReactSwagger: React.FC<ReactSwaggerProps> = ({
  spec,
  docExpansion = "list",
  defaultModelsExpandDepth = 1,
  defaultModelRendering = "example",
  displayOperationId = false,
  displayRequestDuration = false,
  filter = false,
  showExtensions = false,
  showCommonExtensions = false,
  tryItOutEnabled = true,
  supportedSubmitMethods = ["get", "post", "put", "delete", "patch"],
  // validatorUrl = null,
  withCredentials = false,
  persistAuthorization = false,
  deepLinking = true,
  ...props
}) => {
  return (
    <div style={{ width: "100%", height: "100dvh" }}>
      <SwaggerUI
        spec={spec}
        docExpansion={docExpansion}
        defaultModelsExpandDepth={defaultModelsExpandDepth}
        defaultModelRendering={defaultModelRendering}
        displayOperationId={displayOperationId}
        displayRequestDuration={displayRequestDuration}
        filter={filter}
        showExtensions={showExtensions}
        showCommonExtensions={showCommonExtensions}
        tryItOutEnabled={tryItOutEnabled}
        supportedSubmitMethods={supportedSubmitMethods}
        // validatorUrl={validatorUrl}
        withCredentials={withCredentials}
        persistAuthorization={persistAuthorization}
        deepLinking={deepLinking}
        {...props}
      />
    </div>
  );
};
