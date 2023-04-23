const config = require("./common/config/env.config.js");
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

// Connect to MongoDB database
mongoose
  .connect("mongodb://localhost:27017/budge-it-DB", { useNewUrlParser: true })
  .then(() => {
    const jsonErrorHandler = (err, req, res, next) => {
      res.status(500).send({ error: err });
    };

    const app = express();
    app.use(bodyParser.json());
    app.use(jsonErrorHandler);
    app.use(express.json());

    const PocketsRouter = require("./pockets/routes.config.ts");
    PocketsRouter.routesConfig(app);

    app.listen(config.port, function () {
      console.log("app listening at port %s", config.port);
    });
  });
