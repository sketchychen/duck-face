module.exports = function(req, res, next) {
  if(!req.user) { // if there is no active/logged-in user
    req.flash("error", "You must be logged in to access.");
    res.redirect("/auth/login"); // redirect you to the login page
  } else { // if there is a logged-in user
    next(); // keep calm and carry on
  }
}
