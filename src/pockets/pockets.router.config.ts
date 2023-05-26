import PocketsController from "./pockets.controller";
import { Express } from "express";

export default function routesConfig(app: Express) {
  app.get("/pockets", [PocketsController.list]);
  app.get("/pockets/:pocketId", [PocketsController.getById]);

  app.put("/pockets/:pocketId", [PocketsController.updateById]);

  app.post("/pockets", [PocketsController.insert]);
  app.post("/pockets/many", [PocketsController.insertMany]);

  app.delete("/pockets", [PocketsController.removeAll]);
  app.delete("/pockets/:pocketId", [PocketsController.removeById]);
}
