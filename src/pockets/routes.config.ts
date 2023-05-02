const PocketsController = require("./pockets.controller.ts");

exports.routesConfig = function (app) {
  app.get("/pockets", [PocketsController.list]);
  app.get("/pockets/:pocketId", [PocketsController.getById]);

  app.put("/pockets/:pocketId", [PocketsController.updateById]);

  app.post("/pockets", [PocketsController.insert]);

  app.delete("/pockets", [PocketsController.remove]);
};
