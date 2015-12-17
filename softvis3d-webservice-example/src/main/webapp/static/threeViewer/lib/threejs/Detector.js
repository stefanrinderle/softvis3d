/**
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 */

var Detector = {

  canvas: !!window.CanvasRenderingContext2D,
  webgl: (function () {
    try {
      var canvas = document.createElement('canvas');
      return !!( window.WebGLRenderingContext && ( canvas.getContext('webgl') || canvas.getContext('experimental-webgl') ) );
    } catch (e) {
      return false;
    }
  })(),
  workers: !!window.Worker,
  fileapi: window.File && window.FileReader && window.FileList && window.Blob,

  getWebGLErrorMessage: function () {
    if (!this.webgl) {
      if (window.WebGLRenderingContext) {
        return 'Your graphics card does not seem to support WebGL. Find out how to get it on http://get.webgl.org/';
      } else {
        return 'Your browser does not seem to support WebGL. Find out how to get it on http://get.webgl.org/.';
      }
    } else {
      console.log("Works!")
      return "";
    }
  }

};

// browserify support
if (typeof module === 'object') {

  module.exports = Detector;

}