var onPreviewLoad = function(imageSrc, allTheFaces) {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var canvasSize = 512;

  var baseImg = new Image();
  baseImg.src = imageSrc;
  baseImg.crossOrigin = "anonymous";

  var beaks = [];
  allTheFaces.face.forEach(function(face, i) {
    beaks.push({
      img: new Image(),
      faceData: face
    });
    beaks[i].img.src = "/img/duckbeak1.png";
    beaks[i].img.crossOrigin = "anonymous";
  });

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
    beaks.forEach(function(beak, i) {
      var beakWidthNat = beak.img.naturalWidth;
      var beakHeightNat = beak.img.naturalHeight;
      var beakAspectRatio = beakWidthNat / beakHeightNat;

      // the following coordinates from F++ API are percentages of base photo dimensions
      var dataWidth = beak.faceData.position.width;
      var dataHeight = beak.faceData.position.height;
      var dataCenter = beak.faceData.position.center;
      // the following coordinates have been converted to pixels
      var faceWidth = dataWidth / 100 * baseWidth;
      var faceHeight = dataHeight / 100 * baseHeight;
      var faceCenterX = (dataCenter.x) / 100 * baseWidth;
      var faceCenterY = (dataCenter.y) / 100 * baseHeight;
      var beakWidth = faceWidth * 0.9; // 0.9 is arbitrary, based on "look"
      var beakHeight = beakWidth / beakAspectRatio;

      // the following angles from Face++ API are in degrees
      var dataRollAngle = beak.faceData.attribute.pose.roll_angle.value;
      var dataYawAngle = beak.faceData.attribute.pose.yaw_angle.value;
      var dataPitchAngle = beak.faceData.attribute.pose.pitch_angle.value;
      // the following angles have been converted to radians for canvas stuff
      var faceRollAngle = dataRollAngle * Math.PI/180;
      var faceYawAngle = dataYawAngle * Math.PI/180;
      var facePitchAngle = dataPitchAngle * Math.PI/180;

      var c = faceWidth/2 * 0.9; // c for hypotenuse
      var a = c * Math.sin(faceRollAngle); // a for smaller leg, or y presumably
      var b = c * Math.cos(faceRollAngle); // b for longer leg, or x presumably

      // draw each beak
      ctx.save();
      if(faceYawAngle < 0){
        ctx.translate((faceCenterX - b), (faceCenterY - a));
        ctx.rotate(faceRollAngle);
      } else {
        ctx.translate((faceCenterX + b), (faceCenterY + a));
        ctx.scale(-1, 1);
        ctx.rotate(-faceRollAngle);
      }
      ctx.drawImage(beak.img, 0, 0, beakWidth, beakHeight);
      ctx.restore();
    });

    $("#save-form").on("submit", function(event){
      event.preventDefault();

      var featureInPublic = $("#save-form-public").prop("checked");
      var canvasData = canvas.toDataURL("image/jpeg", 0.5);
      var url = "/duckify/preview";

      $.post(url, {
        featureInPublic: featureInPublic,
        dataUrl: canvasData
      })
      .done(function(data) {
        window.location = "/dashboard";
      }).fail(function(error) {
        alert('Error: ' + response.responseText);
      });
    });

  }
} // nothing should exist beyond this scope
