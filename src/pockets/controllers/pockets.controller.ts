const PocketModel = require("../models/pockets.model.ts");

// GET /pockets
exports.list = (req, res) => {
  PocketModel.list()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.getById = (req, res) => {
  PocketModel.getById(req.params.pocketId)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

// POST /pockets
exports.insert = (req, res) => {
  PocketModel.insert(req.body)
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

// DELETE /pockets
exports.remove = (req, res) => {
  PocketModel.remove()
    .then((result) => {
      res.status(200).send("All pockets have been removed");
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};
