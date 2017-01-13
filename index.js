require("dotenv").config();
var express = require("express");
var ejsLayouts = require("express-ejs-layouts");
var bodyParser = require("body-parser");
var session = require("express-session");
var passport = require("./config/ppConfig");
var flash = require("connect-flash");
var cloudinary = require("cloudinary");
var isLoggedIn = require("./middleware/isLoggedIn"); // isLoggedIn.js is custom middleware that we wrote
var db = require("./models");
var app = express();

app.set("view engine", "ejs");

app.use(require("morgan")("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);

app.use(express.static(__dirname + "/static/"));

app.use(session({ // process.env.____ stores on system level, limits scope to hardware of server instead of its code. you want to .gitignore .env so it doesn't go up on the server
  secret: process.env.SESSION_SECRET || "supersecretpassword", // "supersecretpassword" is salt to set people's sessions apart
  resave: false, // if nothing changes, don't continually write to memory
  saveUninitialized: true // if it's a brand new session, save it
}));

app.use(passport.initialize());
app.use(passport.session()); // enables passport to work with session
// needs to happen after/be below session creation (can't use what hasn't been instantiated yet)

app.use(flash());

app.use(function(req, res, next) { // "next" means go through with the response cycle
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user; // req.user is available due to passport
  next(); // continue on
});

app.get("/", function(req, res) { // load index page
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
    res.render("index", { duckfaces: duckfaces });
  })
});

app.get("/dashboard", isLoggedIn, function(req, res) { // runs through isLoggedIn before function(req, res)
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
    res.render("dashboard", { user: user, duckfaces: duckfaces }); // ideally this will present differently with a logged-in user
  })
});

app.use("/auth", require("./controllers/auth")); // add our controller files
app.use("/duckify", require("./controllers/duckify"));

// process.env.____ stores on system level, limits scope to hardware of server instead of its code. you want to .gitignore .env so it doesn't go up on the server
var server = app.listen(process.env.PORT || 3000);

module.exports = server;
