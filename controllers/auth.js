var express = require("express");
var router = express.Router();
var db = require("../models");
var passport = require("../config/ppConfig");

router.get("/signup", function(req, res) {
  res.render("auth/signup");
});

router.post("/signup", function(req, res) {
  db.user.findOrCreate({ // we have a beforeCreate() attached to each user, so that will run before creation happens
    where: { email: req.body.email }, // check to see if the email already exists in the user model
    defaults: { // if the email does not exist already
      name: req.body.name, // create a new user with the given name
      password: req.body.password // and given password after it's been hashed, which should be done according to user.js's hooks
    }
  }).spread(function(user, created) { // then promise (spread because there's more than one possible action with findOrCreate)
    if(created) { // created is either 1 or 0 for new or already existing
      passport.authenticate("local", { // this is the "redirect" version of passport.authenticate()
        successRedirect: "/",
        successFlash: "Account created and logged in." // enabled by require("connect-flash") that's called in index.js and npm-installed
      })(req, res);
    } else {
      req.flash("error", "Email already exists.");
      res.redirect("/auth/signup");
    }
  }).catch(function(error) { // if an error (other than already existing email) occurs
    req.flash("error", error.message);
    res.redirect("/auth/signup");
  });
});

router.get("/login", function(req, res) {
  res.render("auth/login");
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/dashboard",
  failureRedirect: "/auth/login",
  successFlash: "Logged in.",
  failureFlash: "Invalid username and/or password."
}));

router.get("/logout", function(req, res) {
  req.logout(); // .logout() is a passport thing
  req.flash("success", "Logged out."); // .flash() is a connect-flash thing
  res.redirect("/");
});

module.exports = router;
