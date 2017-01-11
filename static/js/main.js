var onPreviewLoad = function(imageSrc, allTheFaces) { // load only when called in appropriate .ejs file.
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var canvasSize = 512;

  // initialize base image, which may not be actually drawn on canvas until ready to export
  // and instead will be displayed for the user as a background image
  // this is to allow editing/redrawing of beaks without having to redraw the background image
  var baseImg = new Image();
  baseImg.src = imageSrc;

  // // initialize all the beaks (one for now), must be before/outside baseImg.onload
  var beakImg = new Image();
  beakImg.src = "/img/duckbeak1.png";

  // initialize all the beaks (one per face), must be before/outside baseImg.onload
  var beaks = [];
  allTheFaces.face.forEach(function(face, i) {
    beaks.push({
      img: new Image(),
      faceData: face
    });
    beaks[i].img.src = "/img/duckbeak1.png";
  });

  console.log(beaks);


  baseImg.onload = function() {
    /* BACKGROUND, THE ORIGINAL PICTURE */
    // draw the background, which is the original image, and leave it alone after
    var baseX = 0;
    var baseY = 0;
    var baseAspectRatio = baseImg.naturalWidth / baseImg.naturalHeight;
    // set the largest dimension to be canvasSize (512px for now) for consistent magnitude of scale
    if (baseAspectRatio > 1) {
      var baseWidth = canvasSize;
      var baseHeight = canvasSize / baseAspectRatio;
      canvas.height = baseHeight;
    } else {
      var baseWidth = canvasSize * baseAspectRatio;
      var baseHeight = canvasSize;
      canvas.width = baseWidth;
    }

    // $("#canvas").css("background-image", "url('" + baseImg.src + "')");
    // $("#canvas").css("background-size", "contain");
    ctx.drawImage(baseImg, baseX, baseY, baseWidth, baseHeight);


    /* DUCK FACES, ALL THE BEAKS */
    // draw all the beaks and enable their editing for user
    beaks.forEach(function(beak) {
      var beakWidthNat = beak.img.naturalWidth;
      var beakHeightNat = beak.img.naturalHeight;
      var beakAspectRatio = beakWidthNat / beakHeightNat;

      // the following coordinates from F++ API are percentages of base photo dimensions
      var dataWidth = beak.faceData.position.width;
      var dataHeight = beak.faceData.position.height;
      var dataNose = beak.faceData.position.nose;
      var dataCenter = beak.faceData.position.center;
      // the following coordinates have been converted to pixels
      var faceWidth = dataWidth / 100 * baseWidth;
      var faceHeight = dataHeight / 100 * baseHeight;
      var faceCenterX = (dataCenter.x) / 100 * baseWidth;
      var faceCenterY = (dataCenter.y) / 100 * baseHeight;
      var beakHeight = beakWidth / beakAspectRatio;
      var beakWidth = faceWidth;

      // the following angles from Face++ API are in degrees
      var rollAngle = beak.faceData.attribute.pose.roll_angle.value;
      var yawAngle = beak.faceData.attribute.pose.yaw_angle.value;
      var pitchAngle = beak.faceData.attribute.pose.pitch_angle.value;
      // the following angles have been converted to radians for canvas stuff
      var beakRollAngle = beak.faceData.attribute.pose.roll_angle.value * Math.PI/180;

      // console.log("x, y:", beakX, beakY);
      // console.log("p, r, y:", pitchAngle, rollAngle, yawAngle);
      // ctx.save();
      // ctx.fillStyle = "#123456";
      // ctx.fillRect(faceCenterX, faceCenterY, 1, 1);
      // ctx.restore();
      // ctx.fillStyle = "#123456";
      // ctx.fillRect((faceCenterX + faceWidth/2), faceCenterY, 1, 1);
      // ctx.restore();
      // ctx.fillStyle = "#123456";
      // ctx.fillRect((faceCenterX - faceWidth/2), faceCenterY, 1, 1);
      // ctx.restore();
      // ctx.fillStyle = "#123456";
      // ctx.fillRect(faceCenterX, (faceCenterY + faceHeight/2), 1, 1);
      // ctx.restore();
      // ctx.fillStyle = "#123456";
      // ctx.fillRect(faceCenterX, (faceCenterY - faceHeight/2), 1, 1);
      // ctx.restore();

      // ctx.save();
      // ctx.translate(beakX, beakY);
      // ctx.rotate(beakRollAngle);
      // if(yawAngle > 0){
      //   ctx.scale(-1, 1);
      // }
      // ctx.drawImage(beak.img, 0, 0, beakWidth, beakHeight);
      // ctx.restore();
    })
    // var beakWidth = beakImg.naturalWidth;
    // var beakHeight = beakImg.naturalHeight;
    // var beakAspectRatio = beakWidth / beakHeight;
    // var beakSize = 50;
    // if (beakAspectRatio > 1) {
    //   var beakWidth_resized = beakSize;
    //   var beakHeight_resized = beakSize / beakAspectRatio;
    // } else {
    //   var beakWidth_resized = beakSize * beakAspectRatio;
    //   var beakHeight_resized = beakSize;
    // }
    // ctx.drawImage(beakImg, 0, 0, beakWidth_resized, beakHeight_resized);
  }

  // function hitImage(x, y) {
  //     return (x > imageX && x < imageX + imageWidth && y > imageY && y < imageY + imageHeight);
  // }
  //
  //
  // function handleMouseDown(e) {
  //     startX = parseInt(e.clientX - offsetX);
  //     startY = parseInt(e.clientY - offsetY);
  //     draggingResizer = anchorHitTest(startX, startY);
  //     draggingImage = draggingResizer < 0 && hitImage(startX, startY);
  // }
  //
  // function handleMouseUp(e) {
  //     draggingResizer = -1;
  //     draggingImage = false;
  //     draw(true, false);
  // }
  //
  // function handleMouseOut(e) {
  //     handleMouseUp(e);
  // }

} // nothing should exist beyond this line
