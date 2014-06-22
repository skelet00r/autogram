'use strict';
angular.module('Autogram-Directives', [])

.directive("autogram", ['$ionicGesture', '$rootScope', 'canvas',
  function($ionicGesture, $rootScope, canvas) {
    return {
      restrict: "A",
      link: function(scope, element, attr) {
        //https://github.com/driftyco/ionic/issues/1057
        if (typeof(attr.offset) === "undefined") {
          attr.offset = 0;
        }
        if (typeof(attr.color) === "undefined") {
          attr.color = '#4bf';
        }
        element[0].width = window.innerWidth;
        element[0].height = window.innerHeight - attr.offset;
        var ctx = element[0].getContext('2d');
        ctx.translate(0.5, 0.5);
        var startX = 0,
          startY = 0,
          startedDrawing = false;
        console.log("v0.0.2");

        window.addEventListener('resize', function() {
          if (startedDrawing == false) {
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

        $ionicGesture.on('dragstart', dragStart, element);
        $ionicGesture.on('drag', drag, element);
        $ionicGesture.on('dragend', dragEnd, element);

        drawWatermark();
        drawIntructions();

        function dragStart(event) {
          if (startedDrawing === false) {
            clearContext();
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
          if (!startY)
            startY = event.gesture.touches[0].clientY;
        }

        function drag(event) {
          var currentX = event.gesture.touches[0].clientX;
          var currentY = event.gesture.touches[0].clientY;
          draw(startX, startY, currentX, currentY);
          //console.log("drag from : " + startX + "," + startY + " - to : " + currentX + "," + currentY);
          startX = currentX;
          startY = currentY;
        }

        function dragEnd(event) {
          startX = false;
          startY = false;
        }


        function clearContext() {
          element[0].width = element[0].width;
        }

        function draw(lX, lY, cX, cY) {
          // line from
          ctx.moveTo(lX, lY);
          // to
          ctx.lineTo(cX, cY);
          // color
          ctx.strokeStyle = attr.color;
          // draw it
          ctx.stroke();
        }

        function drawWatermark() {
          ctx.fillStyle = "#F08080";
          ctx.font = "16px Arial";
          ctx.fillText("Autogram", 20, 20);
          ctx.fillText("Source available on Github", 20, 40);
        }

        function drawIntructions() {
          ctx.setLineDash([6]);
          var inset = 6;
          var width = element[0].width - (element[0].width / inset);
          var height = element[0].height - (element[0].height / inset);
          var x = (element[0].width / inset) / 2;
          var y = (element[0].height / inset) / 2;
          ctx.strokeRect(x, y, width, height);
          ctx.font = "30px Arial";
          ctx.fillText("Sign Here", ((width / 2) + x) - 80, (height / 2) + y);
          ctx.setLineDash([0]);
        }

        $rootScope.$on('destroyAutogram', function(event, data) {
          clearContext();
          drawWatermark();
          drawIntructions();
          startedDrawing = false;
        });

        $rootScope.$on('saveAutogram', function(event, data) {
          if (startedDrawing === false) {
            //havent drawn anything yet
            //or
            //running on desktop
            return;
          }

          canvas.save(
            function(success) {
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
]);