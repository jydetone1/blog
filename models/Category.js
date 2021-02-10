const mongoose = require("mongoose");
const URLSlugs = require("mongoose-url-slugs");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
  },
});

CategorySchema.plugin(URLSlugs("name", { field: "slug" }));
module.exports = mongoose.model("categories", CategorySchema);
