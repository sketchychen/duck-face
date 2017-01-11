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
  var faceppUrl = "http://api.us.faceplusplus.com/detection/detect?url="
  + req.session.upload.url
  + "&api_secret=" + process.env.FACEPP_SECRET
  + "&api_key=" + process.env.FACEPP_KEY
  + "&attribute=pose";

  request(faceppUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var faces = body;
      // req.session.faces = {
      //   faces: JSON.parse(body).face
      // };
      // console.log(req.session.faces);
      res.render("duckify/preview", { faces: faces, imageSrc: req.session.upload.url });
    }
  });
});

// POST "/preview"
// create: resulting duckified to cloud
// redirect to duckified's show page

module.exports = router;
