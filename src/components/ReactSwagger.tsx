"use client";

import React, { useMemo, useCallback } from "react";
import SwaggerUI, { SwaggerUIProps } from "swagger-ui-react";
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
  supportedSubmitMethods?: string[];
  validatorUrl?: string | null;
  withCredentials?: boolean;
  persistAuthorization?: boolean;
  deepLinking?: boolean;
  onComplete?: () => void;
  requestInterceptor?: (request: any) => any;
  responseInterceptor?: (response: any) => any;
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
  validatorUrl = null,
  withCredentials = false,
  persistAuthorization = false,
  deepLinking = true,
  onComplete,
  requestInterceptor,
  responseInterceptor,
  ...props
}) => {
  const memoizedSpec = useMemo(() => spec, [spec]);
  const swaggerConfig = useMemo<SwaggerUIProps>(
    () => ({
      spec: memoizedSpec,
      docExpansion,
      defaultModelsExpandDepth,
      defaultModelRendering,
      displayOperationId,
      displayRequestDuration,
      filter,
      showExtensions,
      showCommonExtensions,
      tryItOutEnabled,
      validatorUrl,
      withCredentials,
      persistAuthorization,
      deepLinking,
      onComplete,
      requestInterceptor,
      responseInterceptor,
      showMutatedRequest: true,
      ...props,
    }),
    [
      memoizedSpec,
      docExpansion,
      defaultModelsExpandDepth,
      defaultModelRendering,
      displayOperationId,
      displayRequestDuration,
      filter,
      showExtensions,
      showCommonExtensions,
      tryItOutEnabled,
      validatorUrl,
      withCredentials,
      persistAuthorization,
      deepLinking,
      onComplete,
      requestInterceptor,
      responseInterceptor,
      props,
    ]
  );

  const handleComplete = useCallback(() => {
    const originalConsoleWarn = console.warn;
    console.warn = (...args) => {
      if (
        args[0] &&
        typeof args[0] === "string" &&
        (args[0].includes("UNSAFE_componentWillReceiveProps") ||
          args[0].includes("componentWillReceiveProps"))
      ) {
        return;
      }
      originalConsoleWarn.apply(console, args);
    };

    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);

  return (
    <div style={{ display: "grid" }}>
      <SwaggerUI {...swaggerConfig} onComplete={handleComplete} />
    </div>
  );
};
