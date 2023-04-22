const config = require("./common/config/env.config.js");

const express = require("express");
const app = express();

const PocketsRouter = require("./pockets/routes.config.ts");

app.use(function (req, res, next) {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  } else {
    return next();
  }
});

app.use(express.json());
PocketsRouter.routesConfig(app);

app.listen(config.port, function () {
  console.log("app listening at port %s", config.port);
});
