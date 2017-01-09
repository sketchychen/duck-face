var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var db = require("../models");

passport.serializeUser(function(user, callback) { // callback in this case refers to a parameter that is a function (while the user parameter is an object in this case)
  callback(null, user.id); // i guess this callback function has two parameters
}); // here the user ID is serialized to the session, keeping the amount of data
// stored within the session small. When subsequent requests are received, this
// ID is used to find the user, which will be restored to req.user.

passport.deserializeUser(function(id, callback) { // ends the session for the user
  db.user.findById(id).then(function(user) {
    callback(null, user);
  }).catch(callback);
});

passport.use(new LocalStrategy({ // validates login details
  usernameField: "email", // i assume these refer to the name attributes in the login form inputs
  passwordField: "password"
}, function(email, password, callback) {
  db.user.find({
    where: {
      email: email // in this case, search for user by email since they are asked to login using email
    }
  }).then(function(user) {
    if(!user || !user.validPassword(password)) { // we made validPassword() in our model file user.js
      callback(null, false); // the false stomps the execution of our routes
    } else { // if the password is valid for the user
      callback(null, user); // carry on with the user with whatever the callback function is
    }
  }).catch(callback); // any errors get sent in through here
}));

module.exports = passport;
