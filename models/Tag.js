const mongoose = require("mongoose");
const URLSlugs = require("mongoose-url-slugs");
const Schema = mongoose.Schema;

const TagSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  slug: {
    type: String,
  },
});
TagSchema.plugin(URLSlugs("name", { field: "slug" }));
module.exports = mongoose.model("tags", TagSchema);
