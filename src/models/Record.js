const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecordSchema = new Schema({
  key: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  counts: {
    type: [Number],
  },
  value: {
    type: String,
  },
});

module.exports = mongoose.model("records", RecordSchema);
