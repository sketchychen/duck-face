require("dotenv").config();
var express = require("express");
var ejsLayouts = require("express-ejs-layouts");
var bodyParser = require("body-parser");
var session = require("express-session");
var passport = require("./config/ppConfig");
var flash = require("connect-flash");
var cloudinary = require("cloudinary");
var isLoggedIn = require("./middleware/isLoggedIn");
var db = require("./models");
var app = express();

app.set("view engine", "ejs");

app.use(require("morgan")("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);

app.use(express.static(__dirname + "/static/"));

app.use(session({
  secret: process.env.SESSION_SECRET || "supersecretpassword",
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function(req, res, next) {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

app.get("/", function(req, res) {
  console.log(res.locals.currentUser);
  db.duckified.findAll({
    where: {
      public: "TRUE"
    },
    order: [["createdAt", "DESC"]]
  }).then(function(duckifieds) {
    var duckfaces = [];
    duckifieds.forEach(function(duckified){
      duckfaces.push(cloudinary.url(duckified.cloudID));
    })
    res.render("index", { user: res.locals.currentUser, duckfaces: duckfaces });
  })
});

app.get("/dashboard", isLoggedIn, function(req, res) {
  db.user.findOne({
    where: {
      id: res.locals.currentUser.id
    },
    include: [db.duckified]
  }).then(function(user) {
    var duckfaces = [];
    user.duckifieds.forEach(function(duckified){
      duckfaces.push(cloudinary.url(duckified.cloudID));
    })
    res.render("dashboard", { user: user, duckfaces: duckfaces });
  })
});

app.use("/auth", require("./controllers/auth"));
app.use("/duckify", require("./controllers/duckify"));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
