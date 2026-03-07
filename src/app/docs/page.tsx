"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function DocsPage() {
    if (process.env.NODE_ENV === "production") {
        return <div>404 - Page not found</div>;
    }

    return <SwaggerUI url="/api/swagger" />;
}