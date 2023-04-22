const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pocketSchema = new Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

const pocketModel = mongoose.model("Pockets", pocketSchema);

const fakePocketData = [
  {
    id: 1,
    name: "Entertainment",
    amount: 1000,
  },
  {
    id: 2,
    name: "Food",
    amount: 2000,
  },
  {
    id: 3,
    name: "Bills",
    amount: 3000,
  },
  {
    id: 4,
    name: "Subscriptions",
    amount: 200,
  },
  {
    id: 5,
    name: "Daycare",
    amount: 3000,
  },
  {
    id: 6,
    name: "Daycare",
    amount: 3000,
  },
  {
    id: 7,
    name: "Daycare",
    amount: 3000,
  },
  {
    id: 8,
    name: "Daycare",
    amount: 3000,
  },
];

exports.list = () => {
  //return pocketModel.find();
  return Promise.resolve(fakePocketData);
};
