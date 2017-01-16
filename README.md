# duck-face

### what?
this is an image gallery site that recognizes faces and superimposes a duck bill over their noses and mouths.

## why?
because.

## how?
face detection/recognization API [Face++](faceplusplus.com) is used to process photos for face data. Requested face data is used to scale, position, and angle one duck beak onto every face the API can detect. Photos are uploaded to a cloud service pre- and post-processing.

## things to do
- switch out signup/login with logout/dashboard in the nav bar when someone has signed in
- allow "guest" access to duckifying with limitations
  - consider what limitations to have
- add email verification
- allow full-image display of public gallery images when clicked on and an X-button, escape key, and/or outside clicking to return to gallery
- provide other image accessory options, like, googly eyes
- make duckface logo
- prevent hotlinking
