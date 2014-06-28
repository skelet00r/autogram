'use strict';
angular.module('Autogram-Controllers', [])

.controller('index-controller', function($scope, $rootScope, $ionicActionSheet, $ionicPopup, Photo) {
  $scope.color = '#000';

  $scope.show = function() {
    var actionSheet = $ionicActionSheet.show({
      buttons: [{
        text: 'Take Picture'
      }, {
        text: 'Pick a color'
      }, {
        text: 'Save to photos'
      }, {
        text: 'Share Autogram'
      }],
      destructiveText: 'Clear Autogram',
      titleText: 'Autogram Options',
      cancelText: 'Cancel',
      buttonClicked: function(index) {
        if (index === 0) {
          $scope.getPhoto();
        } else if (index === 1) {
          $scope.showColor();
          console.log('Color');
        } else if (index === 2) {
          console.log('SAVE');
          $scope.savePhoto();
        } else if (index === 3) {
          console.log('SAVE');
          $scope.share();
        } else {
          console.log('WHO? WHAT? NOW?');
        }
        return true;
      },
      destructiveButtonClicked: function() {
        console.log('DESTROY');
        $scope.clearCanvas();
        actionSheet();
      }
    });
  };

  $scope.showSuccess = function() {
    $ionicPopup.alert({
      title: 'Autogram',
      template: 'Successfully saved to photos'
    });
  };

  $scope.showError = function() {
    $ionicPopup.alert({
      title: 'Autogram',
      template: 'Save Failed'
    });
  };

  $scope.showColor = function() {
    $ionicPopup.alert({
      title: 'Pick a color',
      template: '<colors />'
    });
  };

  $scope.savePhoto = function() {
    $rootScope.$broadcast('saveAutogram');
  };

  $scope.getPhoto = function() {
    Photo.get()
        .then(function(data) {
          $rootScope.$broadcast('takenPicture', data);
        }, function(err) {
          console.log(err);
        });
  };

  $scope.clearCanvas = function() {
    $rootScope.$broadcast('destroyAutogram');
  };

  $scope.share = function() {
    $rootScope.$broadcast('shareAutogram');
  };

  $rootScope.$on('colorChangeAutogram', function(e,data) {
    console.log(data);
    $scope.color = data;
  });

  $rootScope.$on('saveSuccessAutogram', function() {
    $scope.showSuccess();
  });

  $rootScope.$on('saveFailAutogram', function() {
    $scope.showError();
  });

});