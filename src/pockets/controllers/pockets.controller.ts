const PocketModel = require("../models/pockets.model.ts");

exports.list = (req, res) => {
  PocketModel.list().then((result) => {
    res.status(200).send(result);
  });
};
