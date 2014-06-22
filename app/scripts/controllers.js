'use strict';
angular.module('Autogram-Controllers', [])

.controller('index-controller', function($scope, $rootScope, $ionicActionSheet, $ionicPopup) {

  // Triggered on a button click, or some other target
  $scope.show = function() {

    // Show the action sheet
    var actionSheet = $ionicActionSheet.show({
      buttons: [{
        text: 'Choose Color'
      }, {
        text: 'Save to photos'
      }],
      destructiveText: 'Clear Autogram',
      titleText: 'Autogram Options',
      cancelText: 'Cancel',
      buttonClicked: function(index) {
        if(index === 0){
          console.log('Color');
        } else if (index === 1){
          console.log('SAVE');
          $rootScope.$broadcast('saveAutogram');
        } else {
          console.log('WHO? WHAT? NOW?');
        }
        return true;
      },
      destructiveButtonClicked: function(){
        console.log('DESTROY');
        $rootScope.$broadcast('destroyAutogram');
        actionSheet();
      }
    });

  };


  $scope.showSuccess = function() {
   var alertPopup = $ionicPopup.alert({
     title: 'Autogram',
     template: 'Successfully saved to photos'
   });
  };

  $scope.showError = function() {
   var alertPopup = $ionicPopup.alert({
     title: 'Autogram',
     template: 'Save Failed'
   });
  };

  $rootScope.$on('saveSuccessAutogram', function (event, data) {
    $scope.showSuccess();
  });
  $rootScope.$on('saveFailAutogram', function (event, data) {
    $scope.showError();
  });

});