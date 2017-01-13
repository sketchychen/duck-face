require("dotenv").config();
var express = require("express");
var ejsLayouts = require("express-ejs-layouts");
var bodyParser = require("body-parser");
var cloudinary = require("cloudinary");
var isLoggedIn = require("../middleware/isLoggedIn");
var db = require("../models");
var router = express.Router();

// GET "/dashboard"
router.get("/", isLoggedIn, function(req, res) {
  db.user.findOne({
    where: {
      id: res.locals.currentUser.id
    },
    include: [db.duckified]
  }).then(function(user) {
    var duckfaces = [];
    user.duckifieds.forEach(function(duckified){
      duckfaces.push({
        id: duckified.id,
        src: cloudinary.url(duckified.cloudID)
      });
    })
    res.render("dashboard/dashboard", { user: user, duckfaces: duckfaces });
  })
});

// GET "/dashboard/:id"
// show user's picture
// router.get("/:id", isLoggedIn, function(req, res) {
//   db.duckified.findOne({
//     where: {
//       id: req.params.id,
//       userId: res.locals.currentUser.id
//     }
//   }).then(function(duckified) {
//     duckified.src = cloudinary.url(duckified.cloudID);
//     res.render("dashboard/show", { duckified: duckified });
//   });
// });
router.get("/:id", isLoggedIn, function(req, res) {
  db.duckified.findOne({
    where: {
      id: req.params.id
    },
    include: [db.user]
  }).then(function(duckified) {
    duckified.src = cloudinary.url(duckified.cloudID);
    res.render("dashboard/show", { duckified: duckified });
  });
});

module.exports = router;
