'use strict';
angular.module('Autogram-Directives', [])

.directive('autogram', ['$ionicGesture', '$rootScope', 'canvas', 'Share',
  function($ionicGesture, $rootScope, canvas, Share) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        //https://github.com/driftyco/ionic/issues/1057
        if (typeof(attr.offset) === 'undefined') {
          attr.offset = 0;
        }
        if (typeof(attr.color) === 'undefined') {
          attr.color = '#4bf';
        }
        element[0].width = window.innerWidth;
        element[0].height = window.innerHeight - attr.offset;
        var ctx = element[0].getContext('2d');
        ctx.translate(0.5, 0.5);
        var startX = 0,
          startY = 0,
          startedDrawing = false,
          photoLoaded = false,
          imageSrc = {};
        console.log('v0.0.2');

        window.addEventListener('resize', function() {
          if (startedDrawing === false && photoLoaded === false) {
            element[0].width = window.innerWidth;
            element[0].height = window.innerHeight - attr.offset;
            drawWatermark();
            drawIntructions();
          } else {
            var imgData = ctx.getImageData(0, 0, element[0].width, element[0].height);
            element[0].width = window.innerWidth;
            element[0].height = window.innerHeight - attr.offset;
            ctx.putImageData(imgData, 0, 0);
            //set scale
          }

        });

        function dragStart(event) {
          if (startedDrawing === false) {
            if (photoLoaded === true) {
              drawPhoto();
            } else {
              clearContext();
            }
            ctx.beginPath();
            ctx.rect(0, 0, element[0].width, element[0].height);
            ctx.fillStyle = 'white';
            ctx.fill();
            startedDrawing = true;
          }
          ctx.beginPath();
          if (!startX) {
            startX = event.gesture.touches[0].clientX;
          }
          if (!startY) {
            startY = event.gesture.touches[0].clientY - 44;
          }
        }

        function drag(event) {
          var currentX = event.gesture.touches[0].clientX;
          var currentY = event.gesture.touches[0].clientY - 44;
          draw(startX, startY, currentX, currentY);
          //console.log('drag from : ' + startX + ',' + startY + ' - to : ' + currentX + ',' + currentY);
          startX = currentX;
          startY = currentY;
        }

        function dragEnd() {
          startX = false;
          startY = false;
        }


        function clearContext() {
          element[0].width = element[0].width;
        }

        function drawWatermark() {
          ctx.fillStyle = '#F08080';
          ctx.font = '14px Arial';
          ctx.fillText('Autogram', 20, 20);
          ctx.fillText('Source available on Github', 20, 40);
        }

        function drawIntructions() {
          ctx.setLineDash([6]);
          var inset = 6;
          var width = element[0].width - (element[0].width / inset);
          var height = element[0].height - (element[0].height / inset);
          var x = (element[0].width / inset) / 2;
          var y = (element[0].height / inset) / 2;
          ctx.strokeRect(x, y, width, height);
          ctx.font = '30px Arial';
          ctx.fillText('Sign Here', ((width / 2) + x) - 80, (height / 2) + y);
          ctx.setLineDash([0]);
        }

        function drawPhoto() {
          var img = new Image();
          img.onload = function() {
            var width = element[0].height * img.width / img.height;
            var height = element[0].height;
            ctx.drawImage(img, 0, 0, width, height);
          };
          img.src = imageSrc;
        }

        function draw(lX, lY, cX, cY) {
          ctx.moveTo(lX, lY);
          ctx.lineTo(cX, cY);
          ctx.strokeStyle = attr.color;
          ctx.stroke();
        }

        $ionicGesture.on('dragstart', dragStart, element);
        $ionicGesture.on('drag', drag, element);
        $ionicGesture.on('dragend', dragEnd, element);

        drawWatermark();
        drawIntructions();

        $rootScope.$on('takenPicture', function(e, data) {
          photoLoaded = true;
          imageSrc = data;
          if (startedDrawing === true) {
            startedDrawing = false;
          }
          drawPhoto();
        });

        $rootScope.$on('destroyAutogram', function() {
          clearContext();
          drawWatermark();
          drawIntructions();
          startedDrawing = false;
          photoLoaded = false;
        });

        $rootScope.$on('shareAutogram', function() {
          if (startedDrawing === false || photoLoaded === false) {
            return;
          }
          canvas.save(
            function() {
              Share.go(element[0].toDataURL());
              startedDrawing = false;
              clearContext();
              drawWatermark();
              drawIntructions();
            },
            function(err) {
              $rootScope.$broadcast('saveFailAutogram');
              console.log(err);
            },
            element[0]
          );
        });

        $rootScope.$on('saveAutogram', function() {
          if (startedDrawing === false || photoLoaded === false) {
            return;
          }
          canvas.save(
            function() {
              $rootScope.$broadcast('saveSuccessAutogram');
              startedDrawing = false;
              clearContext();
              drawWatermark();
              drawIntructions();
            },
            function(err) {
              $rootScope.$broadcast('saveFailAutogram');
              console.log(err);
            },
            element[0]
          );
        });
      }
    };
  }
])

.directive('colors', ['$rootScope',
  function($rootScope) {
    return {
      restrict: 'E',
      link: function(scope, element) {
        element.append('<div class=\"circle red   \" color="#ff0000"></div>');
        element.append('<div class=\"circle green \" color="#008000"></div>');
        element.append('<div class=\"circle blue  \" color="#0000ff"></div>');
        element.append('<div class=\"circle yellow\" color="#ffff00"></div>');
        element.append('<div class=\"circle white \" color="#ffffff"></div>');
        element.append('<div class=\"circle black \" color="#000000"></div>');

        element.children().on('click', function(event) {
          element.children().removeClass('selected');
          angular.element(event.target).addClass('selected');
          $rootScope.$emit('colorChangeAutogram',angular.element(event.target).attr('color'));
        });

      }
    };
  }
]);