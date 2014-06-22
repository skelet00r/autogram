'use strict';

angular.module('Autogram-Services', [])

.service('canvas', function($window, $rootScope) {
  
  this.save = function(success,error,canvas){
    if(typeof(cordova) === 'undefined'){
      var data = canvas.toDataURL("image/png");
      var win = window.open('about:blank','image from Autogram');
      win.document.write("<p> Right Click the image and save </p><img src='"+data+"' alt='from Autogram'/>");
      success();
    } else {
     window.canvas2ImagePlugin.saveImageDataToLibrary(
          success,error,canvas
      );
    }
  };
});