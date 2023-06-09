import swaggerJsdoc from "swagger-jsdoc";
import express, { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Service Documentation",
      version: "1.0.0",
    },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/docs/schemas.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export const initSwaggerDocs = (app: Express, port: number) => {
  // Swagger page
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in json format
  app.get("docs.json", (req: Request, res: Response) => {
    res.header("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  app.use(express.static("node_modules/swagger-ui-dist"));
  console.log(`Docs available at 'http://host:${port}/docs'`);
};
