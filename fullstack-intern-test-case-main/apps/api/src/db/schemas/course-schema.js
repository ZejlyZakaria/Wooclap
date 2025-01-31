const mongoose = require("mongoose");

const questionSchema = require("./question-schema");

const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    // add a description
    description: {
      type: String,
      maxlength: 256, 
      required: true, 
    },
    questions: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Question",
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = courseSchema;
