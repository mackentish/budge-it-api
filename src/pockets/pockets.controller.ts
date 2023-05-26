import Pocket, { IPocket } from "./pockets.model";
import { Request, Response } from "express";

// GET
async function list(req: Request, res: Response) {
  return Pocket.find()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

async function getById(req: Request, res: Response) {
  return Pocket.findById(req.params.pocketId)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

// PUT
async function updateById(req: Request, res: Response) {
  return Pocket.findByIdAndUpdate(req.params.pocketId, req.body, { new: true })
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

// POST
async function insert(req: Request, res: Response) {
  const pocket = new Pocket(req.body);
  return pocket
    .save()
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

async function insertMany(req: Request, res: Response) {
  return Pocket.insertMany(req.body)
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

// DELETE
async function removeAll(req: Request, res: Response) {
  return Pocket.deleteMany()
    .then((result) => {
      res.status(200).send("All pockets have been removed");
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

async function removeById(req: Request, res: Response) {
  return Pocket.findByIdAndDelete(req.params.pocketId)
    .then((result) => {
      res.status(200).send("Pocket has been removed");
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

export default {
  list,
  getById,
  updateById,
  insert,
  insertMany,
  removeAll,
  removeById,
};
