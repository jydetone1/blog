const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

const ContactSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model("Contact", ContactSchema);
