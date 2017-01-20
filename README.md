# [duck-face](duckface.herokuapp.com)

## what?
this is an image gallery site that recognizes faces and superimposes a duck bill over their noses and mouths.

## why?
because.

## how?
face detection/recognition API [Face++](faceplusplus.com) is used to process photos for face data. Requested face data is used to scale, position, and angle one duck beak onto every face the API can detect. Photos are uploaded to a cloud service pre- and post-processing.

## things to do
- flash login error after incorrect login
- allow "guest" access to duckifying with limitations
  - consider what limitations to have
- add email verification
- allow full-image display of public gallery images when clicked on and an X-button, escape key, and/or outside clicking to return to gallery
- clean up cloud-upload structure (delete pre-processed images from cloud and keep only post-processed images)
- catch file size issues and other errors
- provide other image accessory options, like googly eyes
- make duckface logo
- prevent hotlinking
- add tags/keywords and search function
- allow editing of tags and privacy state
- add webcam photo upload option
