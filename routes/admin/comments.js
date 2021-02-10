const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const Comment = require("../../models/Comment");
const { ensureAuthenticated } = require("../../helpers/auth");

const { isAdmin } = require("../../helpers/auth");

router.all("/*", ensureAuthenticated, (req, res, next) => {
  req.app.locals.layout = "admin";
  next();
});
router.get("/", isAdmin, (req, res) => {
  Comment.find({})
    .populate("user")
    .lean()
    .then((comments) => {
      res.render("admin/comments", { comments: comments });
    });
});

router.post("/", (req, res) => {
  Post.findOne({ _id: req.body.id })
    .then((post) => {
      const newComment = new Comment({
        user: req.user.id,
        body: req.body.body,
      });

      post.comments.unshift(newComment);
      post.save().then((savedPost) => {
        newComment.save().then((savedComment) => {
          req.flash(
            "success_message",
            "Your comment will be reviwed in a second"
          );
          res.redirect(`/post/${post.slug}`);
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/:id", (req, res) => {
  Comment.deleteOne({ _id: req.params.id }).then((deleteItem) => {
    Post.findOneAndUpdate(
      { comments: req.params.id },
      { $pull: { comments: req.params.id } },
      (err, data) => {
        if (err) throw err;
        res.redirect("/admin/comments");
      }
    );
  });
});

router.post("/approve-comment", (req, res) => {
  Comment.findByIdAndUpdate(
    req.body.id,
    { $set: { approveComment: req.body.approveComment } },
    (err, result) => {
      if (err) return err;
      res.send(result);
    }
  );
});
module.exports = router;
