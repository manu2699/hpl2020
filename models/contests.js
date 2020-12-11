const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contestSchema = mongoose.Schema({
  team1: { type: Schema.Types.ObjectId, ref: "hpl_standings" },
  team2: { type: Schema.Types.ObjectId, ref: "hpl_standings" },
  wonBy: { type: Schema.Types.ObjectId, ref: "hpl_standings" },
  contestNo: { type: Number },
  date: { type: Date, default: Date.now },
  isTied: { type: Boolean, default: false }
});

module.exports = mongoose.model("hpl_contests", contestSchema);
