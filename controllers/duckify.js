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
  var fppDetectionDetectUrl = "http://api.us.faceplusplus.com/detection/detect?"
  + "url=" + req.session.upload.url
  + "&api_secret=" + process.env.FACEPP_SECRET
  + "&api_key=" + process.env.FACEPP_KEY
  + "&attribute=pose";

  request(fppDetectionDetectUrl, function (error, response, body) {

    if (!error && response.statusCode == 200) {

      var detects = body;
      // var landmarks = [];
      //
      // JSON.parse(body).face.forEach(function(face) {
      //
      //   var fppDetectionLandmarkUrl = "http://apius.faceplusplus.com/detection/landmark?"
      //   + "api_secret=" + process.env.FACEPP_SECRET
      //   + "&api_key=" + process.env.FACEPP_KEY
      //   + "&face_id=" + face.face_id
      //   + "&type=83p";
      //
      //   request(fppDetectionLandmarkUrl, function(error, response, body) {
      //
      //     if(!error && response.statusCode == 200) {
      //       var result = JSON.parse(body).result[0];
      //       console.log(result);
      //       landmarks.push(result);
      //     }
      //
      //   });
      //
      // });
      // console.log(landmarks);

      // res.render("duckify/preview", {
      //   detects: detects,
      //   landmarks: landmarks,
      //   imageSrc: req.session.upload.url
      // });

      res.render("duckify/preview", {
        detects: detects,
        imageSrc: req.session.upload.url
      });
    }
  });
});

// POST "/preview"
// create: resulting duckified to cloud
// redirect to duckified's show page

module.exports = router;
