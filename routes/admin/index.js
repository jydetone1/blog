const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const Category = require("../../models/Category");
const Comment = require("../../models/Comment");
const { ensureAuthenticated } = require("../../helpers/auth");

router.all("/*", ensureAuthenticated, (req, res, next) => {
  req.app.locals.layout = "admin";
  next();
});

router.get("/", (req, res) => {
  const promises = [
    Post.countDocuments().exec(),
    Category.countDocuments().exec(),
    Comment.countDocuments().exec(),
  ];
  Promise.all(promises).then(([postCount, categoryCount, commentCount]) => {
    res.render("admin/index", {
      postCount: postCount,
      categoryCount: categoryCount,
      commentCount: commentCount,
    });
  });
});

router.get("/", (req, res) => {
  res.render("admin/index");
});
module.exports = router;
