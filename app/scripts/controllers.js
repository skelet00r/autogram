'use strict';
angular.module('Autogram-Controllers', [])

.controller('index-controller', function($scope, $rootScope, $ionicActionSheet, $ionicPopup, Photo) {
  $scope.color = '#000';
  // Triggered on a button click, or some other target
  $scope.show = function() {

    // Show the action sheet
    var actionSheet = $ionicActionSheet.show({
      buttons: [{
        text: 'Take Picture'
      }, {
        text: 'Choose Color'
      }, {
        text: 'Save to photos'
      }],
      destructiveText: 'Clear Autogram',
      titleText: 'Autogram Options',
      cancelText: 'Cancel',
      buttonClicked: function(index) {
        if (index === 0) {
          Photo.get()
            .then(function(data) {
              $rootScope.$broadcast('takenPicture', data);
            }, function(err) {
              console.log(err);
            });
        } else if (index === 1) {
          $scope.showColor();
          console.log('Color');
        } else if (index === 2) {
          console.log('SAVE');
          $rootScope.$broadcast('saveAutogram');

        } else {
          console.log('WHO? WHAT? NOW?');
        }
        return true;
      },
      destructiveButtonClicked: function() {
        console.log('DESTROY');
        $rootScope.$broadcast('destroyAutogram');
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