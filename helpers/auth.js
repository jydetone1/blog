module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/user/login");
  },
  ensureGuest: function (req, res, next) {
    if (req.isAuthenticated()) {
      res.redirect("/dashboard");
    } else {
      return next();
    }
  },
  isAdmin: function (req, res, next) {
    if (req.isAuthenticated() && res.locals.user.admin) {
      return next();
    }
    res.redirect("/admin");
  },
};
