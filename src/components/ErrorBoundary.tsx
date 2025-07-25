"use client";

import { ReactNode, useState, useEffect } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

export function SwaggerErrorBoundary({ children, fallback }: Props) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      setHasError(true);
      setError(event.error);
      console.error("Swagger UI Error:", event.error, event);
    };

    window.addEventListener("error", errorHandler);

    return () => {
      window.removeEventListener("error", errorHandler);
    };
  }, []);

  if (hasError) {
    return (
      fallback || (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            backgroundColor: "#f8f9fa",
            border: "1px solid #dee2e6",
            borderRadius: "8px",
            margin: "1rem",
          }}
        >
          <h2 style={{ color: "#dc3545", marginBottom: "1rem" }}>
            Unable to Load API Documentation
          </h2>
          <p style={{ color: "#6c757d", marginBottom: "1rem" }}>
            There was an error loading the Swagger UI. This might be due to:
          </p>
          <ul
            style={{
              textAlign: "left",
              maxWidth: "500px",
              margin: "0 auto",
              color: "#6c757d",
            }}
          >
            <li>Invalid OpenAPI specification</li>
            <li>Network connectivity issues</li>
            <li>Browser compatibility problems</li>
          </ul>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Reload Page
          </button>
        </div>
      )
    );
  }

  return <>{children}</>;
}
