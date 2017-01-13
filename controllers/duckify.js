var express = require("express");
var router = express.Router();
var db = require("../models");
var request = require("request").defaults({ encoding: null });
var fs = require("fs");

var cloudinary = require("cloudinary");
var multer = require("multer");
var upload = multer({ dest: "./uploads/" });

var isLoggedIn = require("../middleware/isLoggedIn");

// ROOT: "/duckify/"

// GET "/new"
// view: duckify/new.ejs
router.get("/", isLoggedIn, function(req, res) {
  res.render("duckify/new");
})

function getExtension(filename) {
    var parts = filename.split('.');
    console.log(parts[parts.length - 1]);
    return parts[parts.length - 1];
}

function isImage(filename) {
    var ext = getExtension(filename);
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'bmp':
      case 'png':
        //etc
        return true;
    }
    return false;
}

router.post("/", upload.single("myFile"), function(req, res) {
  // upload the image to cloudinary to avoid cross origin issues

  var path;

  if(req.body.uploadType === "file") {

    path = req.file.path;

    cloudinary.uploader.upload(path, function(result) {
      fs.unlinkSync(path, function(error) {
        if(error){
          res.send(error);
        }
      });

      req.session.needsDuckface = {
        url: cloudinary.url(result.public_id)
      }

      res.redirect("/duckify/preview");

    });

  } else if(req.body.uploadType === "link"){
    if(isImage(req.body.imageUrl)) {
      request.get(req.body.imageUrl, function (error, response, body) {

        if (!error && response.statusCode == 200) {

          var data = new Buffer(body).toString('base64');
          var ext = response.headers["content-type"].split("/")[1];
          var buffer = new Buffer(data, "base64");
          path = "./uploads/toDuckify." + ext;

          fs.writeFileSync(path, buffer, function(error) {
            if(error) {
              console.log(error);
            }
          });

          cloudinary.uploader.upload(path, function(result) {
            fs.unlinkSync(path, function(error) {
              if(error) {
                res.send(error);
              }
            });

            req.session.needsDuckface = {
              public_id: result.public_id,
              url: cloudinary.url(result.public_id)
            };

            res.redirect("/duckify/preview");
          });
        }
      });
    }
  }
});

// GET "/preview"
// view: duckify/preview.ejs
router.get("/preview", isLoggedIn, function(req, res) {
  var fppDetectionDetectUrl = "http://api.us.faceplusplus.com/detection/detect?"
  + "url=" + req.session.needsDuckface.url
  + "&api_secret=" + process.env.FACEPP_SECRET
  + "&api_key=" + process.env.FACEPP_KEY
  + "&attribute=pose";

  request(fppDetectionDetectUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var detects = body;
      res.render("duckify/preview", {
        detects: detects,
        imageSrc: req.session.needsDuckface.url
      });
    }
  });
});

// POST "/preview"
// create: resulting duckified to cloud
// redirect to duckified's show page
router.post("/preview", function(req, res) {
  cloudinary.uploader.destroy(req.session.needsDuckface.public_id, function(result) { console.log(result) });
  var string = req.body.dataUrl;
  var regex = /^data:.+\/(.+);base64,(.*)$/;

  var matches = string.match(regex);
  var ext = matches[1];
  var data = matches[2];
  var buffer = new Buffer(data, "base64");
  var path = "./uploads/duckified." + ext;

  fs.writeFileSync(path, buffer, function(error) {
    if(error) {
      console.log(error);
    }
  });

  cloudinary.uploader.upload(path, function(result) {
    fs.unlink(path, function(error) { // asynchronous version
    });

    db.duckified.create({
      cloudID: result.public_id,
      userId: res.locals.currentUser.id,
      public: req.body.featureInPublic
    })
    .then(function(toDuckify) {
      res.redirect("/dashboard");
    });

  });
});

module.exports = router;
