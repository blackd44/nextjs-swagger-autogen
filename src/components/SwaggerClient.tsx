"use client";

import React, { useEffect } from "react";
import { OpenApiSpec } from "../types";
import { SwaggerErrorBoundary } from "./ErrorBoundary";
import { ReactSwagger } from "./ReactSwagger";

interface SwaggerClientProps {
  spec: OpenApiSpec;
  className?: string;
  containerStyle?: React.CSSProperties;
  suppressConsoleWarnings?: boolean;
}

export const SwaggerClient: React.FC<SwaggerClientProps> = ({
  spec,
  className,
  containerStyle = { minHeight: "100dvh", backgroundColor: "white" },
  suppressConsoleWarnings = true,
}) => {
  useEffect(() => {
    const logs = (type: "warn" | "error" = "warn") => {
      const originalConsoleWarn = console?.[type];
      console[type] = (...args) => {
        if (
          typeof args[0] === "string" &&
          (args[0].includes("UNSAFE_componentWillReceiveProps") ||
            args[0].includes("componentWillReceiveProps") ||
            args[0].includes("OperationContainer"))
        ) {
          return;
        }
        originalConsoleWarn(...args);
      };

      return originalConsoleWarn;
    };

    if (suppressConsoleWarnings) {
      const originalConsoleWarn = logs("warn");
      const originalConsoleErr = logs("error");

      return () => {
        console.warn = originalConsoleWarn;
        console.error = originalConsoleErr;
      };
    }
  }, [suppressConsoleWarnings]);

  return (
    <SwaggerErrorBoundary>
      <section className={className} style={containerStyle}>
        <ReactSwagger spec={spec} />
      </section>
    </SwaggerErrorBoundary>
  );
};
