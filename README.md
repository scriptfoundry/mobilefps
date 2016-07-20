## Mobile FPS Survey

An open project to collect actual frame-per-second render performance in mobile browsers.

This project was created to try to determine the proportion of devices are that unable to sustain 60 frames per second in the browser under several discrete conditions:

  1. at rest
  2. with simple DOM mutations
  3. with canvas animations
  4. with CSS3 3d matrix transformations
  5. with touch events

Collected data is, with user consent, sent to the provided Node server, running on a free or low-cost Redhat Openshift server. Currently, data is stored as JSON text files, for off-site processing.

Privacy is extremely important, so no personally identifible information (including IP address) is stored, no server request logs are maintained, and only the data approved by the user is sent or stored.

Bug reports and pull requests are gratefully accepted.

Where vendor prefixes are neccesary, only `-webkit` has been used here (mainly because I don't have a FF device/emulator to work with -- so a pull request would be nice).

Because `window.requestAnimationFrame()` is used to determine browser repaint rates, this test will not work on certain browsers, including all Opera Mini, Safari Mobile 5.1 (and earlier), Android Browser 4.3 (and earlier), Chrome and Webview on Android 4.2 (and earlier), and probably many, many others. 

