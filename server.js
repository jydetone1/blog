const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const Handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const session = require("express-session");
const upload = require("express-fileupload");
const mongoose = require("mongoose");
const passport = require("passport");

const app = express();
const admin = require("./routes/admin/index");
const comment = require("./routes/admin/comments")
const category = require("./routes/admin/categories");
const tag = require("./routes/admin/tags");
const post = require("./routes/admin/posts");
const home = require("./routes/home/index");

const user = require("./routes/home/user");
// const db = require("./config/database");

mongoose
  .connect(process.env.MongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useMongoClient:true 
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

const {
  select,
  multiselect,
  generateDate,
  paginate,
  formatDate,
} = require("./helpers/handlebars-helpers");

app.engine(
  "handlebars",
  exphbs({
    helpers: {
      select: select,
      multiselect: multiselect,
      generateDate: generateDate,
      paginate: paginate,
      formatDate: formatDate,
    },
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: "home",
  })
);

app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

app.use(upload());

app.use(
  session({
    secret: "secret123iloveyou",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// global variables
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  res.locals.success_message = req.flash("success_message");
  res.locals.error_message = req.flash("error_message");
  res.locals.error = req.flash("error");
  res.locals.noMatch = req.flash("noMatch");
  next();
});

app.use("/", home);
app.use("/admin", admin);
app.use("/admin/posts", post);
app.use("/user", user);
app.use("/admin/categories", category);
app.use("/admin/tags", tag);
app.use("/admin/comments", comment);

app.get("*", (req, res) => {
  res.render("home/404page", {
    title: "404",
    message: "Page not found",
  });
});

const port = process.env.PORT 

app.listen(port, () => {
  console.log(`server started on port ${port} `);
});
