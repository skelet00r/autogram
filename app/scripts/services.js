'use strict';

angular.module('Autogram-Services', [])

.service('canvas', function() {
  this.save = function(success, error, canvas) {
    if (typeof(cordova) === 'undefined') {
      var data = canvas.toDataURL('image/png');
      var win = window.open('about:blank', 'image from Autogram');
      win.document.write('<p> Right Click the image and save </p><img src=' + data + ' alt=\'from Autogram\'/>');
      success();
    } else {
      window.canvas2ImagePlugin.saveImageDataToLibrary(
        success, error, canvas
      );
    }
  };
})

.factory('Photo', function($q) {
  return {
    get: function(options) {
      var q = $q.defer();
      if (typeof(cordova) !== 'undefined') {
        navigator.camera.getPicture(function(result) {
          // Do any magic you need
          q.resolve(result);
        }, function(err) {
          q.reject(err);
        }, options);
      } else {
        q.resolve('./images/ionic.png');
      }
      return q.promise;
    }
  };
})

.factory('Share', function() {
  return {
    go: function(data) {
      window.plugins.socialsharing.share(null, null, data, null);
    }
  };
});