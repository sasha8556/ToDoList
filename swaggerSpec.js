const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Your API Title",
      version: "1.0.0",
      description: "API documentation for your application",
    },
    components: {
      securitySchemes: {
        CustomToken: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
          description: 'Вставьте ваш JWT токен без префикса "Bearer"',
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
