const express = require("express");

const routes = require("./routes/index");
require("dotenv").config();
const Sentry = require("@sentry/node");
Sentry.init({
  dsn: process.env.MY_DSN_HERE,
});
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swaggerSpec.js");

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(Sentry.Handlers.errorHandler());

app.use(express.json());
app.use("/api", routes);

const port = process.env.PORT;

app.listen(port, () => console.log("Served started "));

module.exports = app;