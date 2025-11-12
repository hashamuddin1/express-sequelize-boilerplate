// To create a seeders file= npx sequelize-cli seed:generate --name demo-user
// To Create a migration file= npx sequelize-cli migration:generate --name create-user
const express = require("express");
const { sequelize } = require("./models");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();
const port = process.env.PORT;
const responseTime = require("response-time");
const logger = require("./utils/logger");

const client = require("prom-client");

const collectDefaultMetric = client.collectDefaultMetrics;

collectDefaultMetric({ register: client.register });

const app = express();
app.use(express.json());

const reqResTime = new client.Histogram({
  name: "http_express_req_res_time",
  help: "This tells how much time is taken by req and res",
  labelNames: ["method", "route", "status_code"],
  buckets: [
    50, 100, 200, 300, 400, 500, 600, 800, 1000, 1200, 1500, 1800, 2000, 2500,
    3000, 3500, 4000,
  ],
});

const totalRequestCounter = new client.Counter({
  name: "total_req",
  help: "Tells total req",
});

app.use(
  responseTime((req, res, time) => {
    totalRequestCounter.inc();
    reqResTime
      .labels({
        method: req.method,
        route: req.url,
        status_code: req.statusCode,
      })
      .observe(time);
    logger.info(`Request: ${req.method} ${req.url} - ${time.toFixed(2)}ms`);
  })
);

app.use("/user", userRoutes);

app.get("/metrics", async (req, res) => {
  res.setHeader("Content-Type", client.register.contentType);
  const metrics = await client.register.metrics();
  res.send(metrics);
});

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log("Server is running on port 3002");
  });
});
