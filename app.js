const express = require("express");

const routes = require("./routes/index");
require("dotenv").config();
const Sentry = require("@sentry/node");
Sentry.init({
  dsn: "https://8b74f4006228ba10cff05f290fd2b9e1@o4506129094410240.ingest.sentry.io/4506303781535744",
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
