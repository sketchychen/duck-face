var express = require("express");
var router = express.Router();
var db = require("../models");
var request = require("request");
var fs = require("fs");

var cloudinary = require("cloudinary");
var multer = require('multer');
var upload = multer({ dest: './uploads/' });

var isLoggedIn = require("../middleware/isLoggedIn");

// ROOT: "/duckify/"

// GET "/new"
// view: duckify/new.ejs
router.get("/", isLoggedIn, function(req, res) {

  res.render("duckify/new");
})

// // POST "/new"
// router.post("/", function(req, res) {
//   console.log(req.body);
//
//   req.session.upload = {
//     url: req.body.imageUrl
//   }
//   res.redirect("/duckify/preview");
// })

router.post("/", upload.single("myFile"), function(req, res) {
  // upload that image to cloudinary
  // console.log(req.file);
  // console.log("upload", upload);

  var path = req.file.path;

  cloudinary.uploader.upload(path, function(result) {
    fs.unlink(path, function(error) { // asynchronous version
      if(error){
        res.send(error);
      }
    });
    req.session.upload = {
      url: cloudinary.url(result.public_id)
    }
    res.redirect("/duckify/preview");
  });
});


// GET "/preview"
// view: duckify/preview.ejs
router.get("/preview", isLoggedIn, function(req, res) {
  var fppDetectionDetectUrl = "http://api.us.faceplusplus.com/detection/detect?"
  + "url=" + req.session.upload.url
  + "&api_secret=" + process.env.FACEPP_SECRET
  + "&api_key=" + process.env.FACEPP_KEY
  + "&attribute=pose";

  request(fppDetectionDetectUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var detects = body;
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
router.post("/preview", function(req, res) {
  console.log(req.body);

  var string = req.body.dataUrl;
  var regex = /^data:.+\/(.+);base64,(.*)$/;

  var matches = string.match(regex);
  var ext = matches[1];
  var data = matches[2];
  var buffer = new Buffer(data, 'base64');
  var path = './uploads/duckified.' + ext;

  fs.writeFileSync(path, buffer, function(error) {
    if(error) {
      console.log(error);
    }
  });

  cloudinary.uploader.upload(path, function(result) {
    fs.unlink(path, function(error) { // asynchronous version
    });

    // db.duckified.create({
    //   cloudIDPost: result.public_id,
    //   userId: res.locals.currentUser.id
    // })
    // .then(function(toDuckify) {
    //   res.redirect("/dashboard");
    // });

  });
});

module.exports = router;
