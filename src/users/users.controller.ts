import User from "./users.model";
import Pocket from "../pockets/pockets.model";
import { Request, Response } from "express";

// GET
async function list(req: Request, res: Response) {
  return User.find()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

async function getById(req: Request, res: Response) {
  return User.findById(req.params.userId)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

// PUT
async function updateById(req: Request, res: Response) {
  return User.findByIdAndUpdate(req.params.userId, req.body, { new: true })
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

// POST
async function insert(req: Request, res: Response) {
  const user = new User(req.body);
  return user
    .save()
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

async function insertMany(req: Request, res: Response) {
  return User.insertMany(req.body)
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email, password: password });
  if (user) {
    res.status(200).send(user);
  } else {
    res.status(401).send("User not found");
  }
  return;
}

// DELETE
async function removeAll(req: Request, res: Response) {
  return User.deleteMany()
    .then((result) => {
      res.status(200).send("All users have been removed");
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

async function removeById(req: Request, res: Response) {
  return User.findByIdAndDelete(req.params.pocketId)
    .then((result) => {
      res.status(200).send("User has been removed");
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
  login,
  removeAll,
  removeById,
};
