const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const Category = require("../../models/Category");
const Tag = require("../../models/Tag");
const Contact = require("../../models/Contact");

router.all("/*", (req, res, next) => {
  req.app.locals.layout = "home";
  next();
});

router.get("/", (req, res) => {
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    const perPage = 5;
    const page = req.query.page || 1;
    Post.find({ title: regex })
      .populate("user")
      // .populate("category")
      // .populate("tags")
      .skip(perPage * page - perPage)
      .limit(perPage)
      .sort({ date: "desc" })
      .then((posts) => {
        Post.countDocuments().then((postCount) => {
          Category.find({}).then((categories) => {
            Tag.find({}).then((tags) => {
              let errors = [];
              if (posts.length < 1) {
                errors.push({
                  message: "no posts found",
                });
              }
              res.render("home/index", {
                posts: posts,
                categories: categories,
                tags: tags,
                errors: errors,
                current: parseInt(page),
                pages: Math.ceil(postCount / perPage),
                title: 'Home' 
              });
            });
          });
        });
      });
  } else {
    const perPage = 5;
    const page = req.query.page || 1;
    Post.find({})
      .populate("user")
      // .populate("category")
      // .populate("tags")
      .skip(perPage * page - perPage)
      .limit(perPage)
      .sort({ date: "desc" })
      .then((posts) => {
        Post.countDocuments().then((postCount) => {
          Category.find({}).then((categories) => {
            Tag.find({}).then((tags) => {
              res.render("home/index", {
                posts: posts,
                categories: categories,
                tags: tags,
                current: parseInt(page),
                pages: Math.ceil(postCount / perPage),
                 title: 'Home' 

              });
            });
          });
        });
      });
  }
});

router.get("/post/:slug", (req, res) => {
  Post.findOne({ slug: req.params.slug })
    .populate({
      path: "comments",
      match: { approveComment: true },
      populate: { path: "user", model: "users" },
    })
    .populate("user")
    // .populate("category")
    // .populate("tags")
    .then((post) => {
      Category.find({}).then((categories) => {
        Tag.find({}).then((tags) => {
          res.render("home/post", {
            post: post,
            categories: categories,
            tags: tags,
            title: 'Post' 
          });
        });
      });
    });
});

// router.get("/category/:category", (req, res) => {
//   Category.find({}).then((categories) => {
//     Tag.find({}).then((tags) => {
//       Post.find({ category: req.params.category })
//         .populate("user")
//         .populate("category")
//         .populate("tags")
//         .sort({ date: "desc" })
//         .then((posts) => {
//           res.render("home/index", {
//             categories: categories,
//             tags: tags,
//             posts: posts,
//           });
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     });
//   });
// });

router.get("/category/:category", (req, res) => {
  Post.find({ category: req.params.category })
    .populate("user")
    // .populate({
    //   path: "category",
    // })
    // .populate("tags")
    .sort({ date: "desc" })
    .then((posts) => {
      Category.find({}).then((categories) => {
        Tag.find({}).then((tags) => {
          res.render("home/index", {
            posts: posts,
            categories: categories,
            tags: tags,
             title: 'Category' 
          });
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
// router.get("/tag/:tag", (req, res) => {
//   Tag.find({}).then((tags) => {
//     Category.find({}).then((categories) => {
//       Post.find({ tags: req.params.tag })
//         .populate("user")
//         // .populate("category")
//         // .populate("tags")
//         .sort({ date: "desc" })
//         .then((posts) => {
//           res.render("home/index", {
//             tags: tags,
//             categories: categories,
//             posts: posts,
//           });
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     });
//   });
// });

router.get("/tag/:tag", (req, res) => {
  Post.find({ tags: req.params.tag })
    .populate("user")
    // .populate({
    //   path: "category",
    // })
    // .populate("tags")
    .sort({ date: "desc" })
    .then((posts) => {
      Tag.find({}).then((tags) => {
        Category.find({}).then((categories) => {
          res.render("home/index", {
            posts: posts,
            tags: tags,
            categories: categories,
            title: 'Tag' 
    
          });
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/contact", (req, res) => {
  res.render("home/contact", { title: 'Contact' });
});

router.post("/contact", (req, res) => {
  let errors = [];

  if (!req.body.name) {
    errors.push({ message: "please add a name" });
  }

  if (!req.body.email) {
    errors.push({ message: "please add an email" });
  }

  if (!req.body.message) {
    errors.push({ message: "please enter a message" });
  }

  if (errors.length > 0) {
    res.status(302).send({ errors: errors });
  } else {
    const userContact = new Contact({
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
    });
    userContact
      .save()
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({ Error: err.msg });
      });
  }
});

router.get("/about", (req, res) => {
  res.render("home/about",{ title: 'About' } );
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;
