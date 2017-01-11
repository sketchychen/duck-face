var express = require("express");
var router = express.Router();
var db = require("../models");
var request = require("request");

// ROOT: "/duckify/"

// GET "/upload"
// view: duckify/upload.ejs
router.get("/", function(req, res) {
  res.render("duckify/upload");
})

// POST "/upload"
router.post("/", function(req, res) {
  console.log(req.body);
  req.session.upload = {
    url: req.body.imageUrl
  }
  res.redirect("/duckify/preview");
})

// GET "/preview"
// view: duckify/preview.ejs
router.get("/preview", function(req, res) {
  console.log(req.session.upload.url);
  res.render("duckify/preview", { imageSrc: req.session.upload.url });
})

// POST "/preview"
// create: resulting duckified to cloud
// redirect to duckified's show page

module.exports = router;
