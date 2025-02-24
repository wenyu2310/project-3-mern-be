const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    anonymity: {
      type: String,
      required: true,
      emu: ["Not Anonymous", "Anonymous"],
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const likeSchema = new mongoose.Schema(
  {
    like: {
      type: String,
      required: true,
      emu: ["Like", "Dislike"],
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const ideaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    anonymity: {
      type: String,
      required: true,
      emu: ["Non Anonymous", "Anonymous"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    comments: [commentSchema],
    likes: [likeSchema],
  },
  { timestamps: true }
);

const Idea = mongoose.model("Idea", ideaSchema);

module.exports = Idea;
