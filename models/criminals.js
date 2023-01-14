const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const nokSchema = new Schema({
  name: { type: String },
  mobile: { type: String },
  relationship: { type: String },
});

const criminalsSchema = new Schema(
  {
    sname: { type: String, required: true },
    othername: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    height: { type: Number, required: true, min: 0, max: 8 },
    weight: { type: Number, required: true, min: 0 },
    nationality: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, required: true },
    marital_status: { type: String, required: true },
    crime: { type: String, required: true },
    address: { type: String, required: true },
    officer: { type: String, required: true },
    imageUrl: { type: String, required: true },
    dod: { type: Date, required: true },
    dos: { type: Date, required: true },
    sentence_duration: { type: Number, default: 0 },
    nok: { type: nokSchema, default: () => ({}) },
    criminal_id: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Criminal", criminalsSchema);
