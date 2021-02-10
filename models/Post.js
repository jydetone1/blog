const mongoose = require("mongoose");

const URLSlugs = require("mongoose-url-slugs");

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },

    slug: {
      type: String,
    },
    allowComments: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
    },

    tags: [
      {
        type: String,
      },
    ],
    excerpt: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      default: "public",
    },
    file: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "comments",
      },
    ],
  },
  { usePushEach: true }
);
PostSchema.plugin(URLSlugs("title", { field: "slug" }));
module.exports = mongoose.model("posts", PostSchema);
