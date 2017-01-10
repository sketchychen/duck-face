var onPreviewLoad = function() { // load this script only when called in appropriate .ejs file.
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
    if (baseAspectRatio > 1) {
      var baseWidth = canvasSize;
      var baseHeight = canvasSize / baseAspectRatio;
      var baseY = (canvasSize - baseHeight) / 2;
    } else {
      var baseWidth = canvasSize * baseAspectRatio;
      var baseHeight = canvasSize;
      var baseX = (canvasSize - baseWidth) / 2;
    }
    ctx.drawImage(baseImg, baseX, baseY, baseWidth, baseHeight);


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
}
