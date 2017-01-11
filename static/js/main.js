var onPreviewLoad = function() { // load only when called in appropriate .ejs file.

  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var canvasSize = 512;

  // initialize background
  var baseImg = new Image();
  baseImg.src = $("#original-url").text();



  // initialize all the beaks (one for now), must be before/outside baseImg.onload
  var beakImg = new Image();
  beakImg.src = "/img/duckbeak1.png";

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

    $("#canvas").css("background-image", "url('" + baseImg.src + "')");
    $("#canvas").css("background-size", "contain");
    // ctx.drawImage(baseImg, baseX, baseY, baseWidth, baseHeight);


    /* DUCK FACES, ALL THE BEAKS */
    // draw all the beaks and enable their editing for user
    var beakWidth = beakImg.naturalWidth;
    var beakHeight = beakImg.naturalHeight;
    var beakAspectRatio = beakWidth / beakHeight;
    var beakSize = 50;
    if (beakAspectRatio > 1) {
      var beakWidth_resized = beakSize;
      var beakHeight_resized = beakSize / beakAspectRatio;
    } else {
      var beakWidth_resized = beakSize * beakAspectRatio;
      var beakHeight_resized = beakSize;
    }
    ctx.drawImage(beakImg, 0, 0, beakWidth_resized, beakHeight_resized);
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
