'use strict';
/* global StatusBar */

angular.module('Autogram', ['ionic','Autogram-Controllers','Autogram-Directives','Autogram-Services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      window.StatusBar.styleDefault();
    }
  });
});
