const PocketsController = require("./controllers/pockets.controller.ts");

exports.routesConfig = function (app) {
  app.get("/pockets", [PocketsController.list]);
};
