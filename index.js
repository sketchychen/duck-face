require("dotenv").config();
var express = require("express");
var ejsLayouts = require("express-ejs-layouts");
var bodyParser = require("body-parser");
var session = require("express-session");
var passport = require("./config/ppConfig");
var flash = require("connect-flash");
var isLoggedIn = require("./middleware/isLoggedIn"); // isLoggedIn.js is custom middleware that we wrote
var app = express();

app.set("view engine", "ejs");

app.use(require("morgan")("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);

app.use(express.static(__dirname + "/public/"));

app.use(session({ // process.env.____ stores on system level, limits scope to hardware of server instead of its code. you want to .gitignore .env so it doesn't go up on the server
  secret: process.env.SESSION_SECRET || "supersecretpassword", // "supersecretpassword" is salt to set people's sessions apart
  resave: false, // if nothing changes, don't continually write to memory
  saveUninitialized: true // if it's a brand new session, save it
  // cookie: { secure: true } // but we're not using it here. see expressjs session documentation as setting secure to true requires HTTPS
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
  res.render("index");
});

app.get("/profile", isLoggedIn, function(req, res) { // runs through isLoggedIn before function(req, res)
  res.render("profile"); // ideally this will present differently with a logged-in user
});

app.use("/auth", require("./controllers/auth")); // add our controller files

// process.env.____ stores on system level, limits scope to hardware of server instead of its code. you want to .gitignore .env so it doesn't go up on the server
var server = app.listen(process.env.PORT || 3000);

module.exports = server;
