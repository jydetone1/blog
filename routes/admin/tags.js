const express = require("express");
const router = express.Router();
const Tag = require("../../models/Tag");
const { ensureAuthenticated } = require("../../helpers/auth");
const { isAdmin } = require("../../helpers/auth");

router.all("/*", ensureAuthenticated, (req, res, next) => {
  req.app.locals.layout = "admin";
  next();
});

router.get("/", isAdmin, (req, res) => {
  Tag.find({}).then((tags) => {
    res.render("admin/tags/index", { tags: tags });
  });
});

router.post("/create", (req, res) => {
  const newTag = new Tag({
    name: req.body.name,
  });
  newTag
    .save()
    .then((tag) => {
      res.redirect("/admin/tags");
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/edit/:id", isAdmin, (req, res) => {
  Tag.findOne({ _id: req.params.id }).then((tag) => {
    res.render("admin/tags/edit", { tag: tag });
  });
});

router.put("/edit/:id", isAdmin, (req, res) => {
  Tag.findOne({ _id: req.params.id })
    .then((tag) => {
      tag.name = req.body.name;

      tag.save().then((savedTag) => {
        res.redirect("/admin/tags");
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/:id", (req, res) => {
  Tag.deleteOne({ _id: req.params.id })
    .then((result) => {
      res.redirect("/admin/tags");
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
