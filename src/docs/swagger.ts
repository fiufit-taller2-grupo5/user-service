import swaggerJsdoc from "swagger-jsdoc";
import { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "user-service docs",
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
  apis: ["./src/routes/*.ts"],
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

  console.log(`Docs available at 'http://host:${port}/docs'`);
};
