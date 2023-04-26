const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pocketSchema = new Schema(
  {
    name: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

const pocketModel = mongoose.model("Pockets", pocketSchema);

// Get all pockets
exports.list = () => {
  return pocketModel.find();
};

// Get a single pocket by id
exports.getById = (id) => {
  return pocketModel.findById(id);
};

// Create a new pocket or multiple pockets
exports.insert = (pocketData) => {
  // throw error if pocketData is not provided
  if (!pocketData) throw new Error("pocketData is required");
  if (!pocketData.length) {
    // insert single document if pocketData is not an array
    const pocket = new pocketModel(pocketData);
    return pocket.save();
  } else {
    // insert multiple documents if pocketData is an array
    return pocketModel.insertMany(pocketData);
  }
};

// Delete all pockets
exports.remove = () => {
  return pocketModel.deleteMany();
};
