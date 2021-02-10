const express = require("express");
const router = express.Router();
const Category = require("../../models/Category");
const { ensureAuthenticated } = require("../../helpers/auth");
const { isAdmin } = require("../../helpers/auth");

router.all("/*", ensureAuthenticated, (req, res, next) => {
  req.app.locals.layout = "admin";
  next();
});

router.get("/", isAdmin, (req, res) => {
  Category.find({}).then((categories) => {
    res.render("admin/categories/index", { categories: categories });
  });
});

router.post("/create", (req, res) => {
  const newCategory = new Category({
    name: req.body.name,
  });
  newCategory
    .save()
    .then((category) => {
      res.redirect("/admin/categories");
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/edit/:id", isAdmin, (req, res) => {
  Category.findOne({ _id: req.params.id }).then((category) => {
    res.render("admin/categories/edit", { category: category });
  });
});

router.put("/edit/:id", isAdmin, (req, res) => {
  Category.findOne({ _id: req.params.id })
    .then((category) => {
      category.name = req.body.name;

      category.save().then((savedCategory) => {
        res.redirect("/admin/categories");
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/:id", (req, res) => {
  Category.deleteOne({ _id: req.params.id })
    .then((result) => {
      res.redirect("/admin/categories");
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
