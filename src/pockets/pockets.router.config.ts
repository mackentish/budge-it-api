import PocketsController from "./pockets.controller";
import { Express } from "express";

export default function routesConfig(app: Express) {
  app.get("/pockets/:userId", [PocketsController.list]);
  app.get("/pockets/:pocketId", [PocketsController.getById]);

  app.put("/pockets/:pocketId", [PocketsController.updateById]);

  app.post("/pockets/:userId", [PocketsController.insert]);
  app.post("/pockets/many", [PocketsController.insertMany]);

  app.delete("/pockets/:userId", [PocketsController.removeAll]);
  app.delete("/pockets/:pocketId", [PocketsController.removeById]);
}
