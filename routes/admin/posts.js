const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const Category = require("../../models/Category");
const Tag = require("../../models/Tag");
const { isEmpty, uploadDir } = require("../../helpers/upload-helper");
const fs = require("fs");
// const Comment = require("../../models/Comment");
const { ensureAuthenticated } = require("../../helpers/auth");

router.all("/*", ensureAuthenticated, (req, res, next) => {
  req.app.locals.layout = "admin";
  next();
});

router.get("/", (req, res) => {
  Post.find({})
    .sort({ date: "desc" })
    .then((posts) => {
      res.render("admin/posts/index", { posts: posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

// router.get("/", (req, res) => {
//   Post.find({})
//     .sort()
//     .then((posts) => {
//       Category.find({})
//         .then((categories) => {
//           res.render("admin/posts/index", {
//             posts: posts,
//             categories: categories,
//           });
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     });
// });

router.get("/my-posts", (req, res) => {
  Post.find({ user: req.user.id })
    // .populate("category")
    // .populate("user")
    // .populate("tag")
    .sort({ date: "desc" })
    .then((posts) => {
      res.render("admin/posts/my-posts", { posts: posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/create", (req, res) => {
  Category.find({})
    .then((categories) => {
      Tag.find({}).then((tags) => {
        res.render("admin/posts/create", {
          categories: categories,
          tags: tags,
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/create", (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({ message: "please add a title" });
  }

  if (!req.body.excerpt) {
    errors.push({ message: "please add a excerpt" });
  }
  if (!req.body.body) {
    errors.push({ message: "please add a description" });
  }

  if (errors.length > 0) {
    res.render("admin/posts/create", {
      errors: errors,
    });
  } else {
    let filename = "blog2.jpg";

    if (!isEmpty(req.files)) {
      let file = req.files.file;
      filename = Date.now() + "-" + file.name;

      file.mv("./public/uploads/" + filename, (err) => {
        if (err) throw err;
      });
    }

    let allowComments = true;

    if (req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }

    const newPost = new Post({
      user: req.user.id,
      title: req.body.title,
      excerpt: req.body.excerpt,
      status: req.body.status,
      allowComments: allowComments,
      body: req.body.body,
      category: req.body.category,
      tags: req.body.tags,
      file: filename,
    });

    newPost
      .save()
      .then((savedPost) => {
        res.redirect("/admin/posts");
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

router.get("/edit/:id", (req, res) => {
  Post.findOne({ _id: req.params.id }).then((post) => {
    Category.find({})
      .then((categories) => {
        Tag.find({}).then((tags) => {
          if (post.user != req.user.id) {
            res.redirect("/admin/posts");
          } else {
            res.render("admin/posts/edit", {
              post: post,
              categories: categories,
              tags: tags,
            });
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

router.put("/edit/:id", (req, res) => {
  Post.findOne({ _id: req.params.id }).then((post) => {
    if (req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }

    post.user = req.user.id;
    post.title = req.body.title;
    post.excerpt = req.body.excerpt;
    post.status = req.body.status;
    post.allowComments = allowComments;
    post.body = req.body.body;
    post.category = req.body.category;
    post.tags = req.body.tags;

    if (!isEmpty(req.files)) {
      let file = req.files.file;
      filename = Date.now() + "-" + file.name;
      post.file = filename;

      file.mv("./public/uploads/" + filename, (err) => {
        if (err) throw err;
      });
    }

    post.save().then((updatedPost) => {
      req.flash("success_message", "Post was successfully updated");

      res.redirect("/admin/posts/my-posts");
    });
  });
});

router.delete("/:id", (req, res) => {
  Post.findOne({ _id: req.params.id })
    .populate("comments")
    .then((post) => {
      fs.unlink(uploadDir + post.file, (err) => {
        if (!post.comments.length < 1) {
          post.comments.forEach((comment) => {
            comment.remove();
          });
        }
        post.remove().then((postRemoved) => {
          req.flash("success_message", "Post was successfully deleted");
          res.redirect("/admin/posts/my-posts");
        });
      });
    });
});

module.exports = router;
