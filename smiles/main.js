"use strict";
(function(){
	document.addEventListener("DOMContentLoaded", function(){
		var cvs = document.getElementById("cvs"),
			ctx = cvs.getContext("2d");
		cvs.width = window.innerWidth;
		cvs.height = window.innerHeight;

		positionsAPI.calculateText("there is");
		positionsAPI.calculateText("a smile");
		positionsAPI.calculateText("in the");
		positionsAPI.calculateText("w☺rd");
		drawAPI.ctx = ctx;

		positionsAPI.oncalculate = function(positions, text, radius){
			if(text == "there is")
				drawAPI.drawShapesInDelay({"positions": positions, "delay": 3000, "radius": radius}, true, 2000);
			drawAPI.drawShapesInDelay({"positions": positions, "delay": 3000, "radius": radius});
		};

		window.onresize = function(){
			cvs.width = window.innerWidth;
			cvs.height = window.innerHeight;
		};
	}, false);

	var positionsAPI = (function(){
		var worker = new Worker("worker.js"),
			canvas = document.createElement("canvas"),
			ctx = canvas.getContext("2d");

		worker.addEventListener("message", function(event){
			var data = event.data,
				positions = data.positions,
				text = data.text,
				radius = data.radius,
				distance = data.distance;
			if(api.oncalculate && typeof api.oncalculate == "function")
				api.oncalculate.call(undefined, positions, text, radius, distance);
		}, false);

		function drawTextAndCalculate(text, width, height){
			canvas.width != width && (canvas.width = width);
			canvas.height != height && (canvas.height = height);
			ctx.clearRect(0, 0, width, height);
			ctx.textAlign = "center";
			ctx.fillStyle = "black";

			var fontSize = 1,
				innerWidth = width-width/10|0,
				innerHeight = height-height/10|0;
			while(true){
				fontSize++;
				ctx.font = fontSize+"px Arial";
				var metrics = ctx.measureText(text);
				if(metrics.width < innerWidth || metrics.height < innerHeight)
					continue;
				break;
			}

			ctx.font = fontSize+"px Arial";
			ctx.fillText(text, width/2|0, height*2/3|0);
			var imageData = ctx.getImageData(0, 0, width, height);
			var distance = fontSize/20|0,
				radius = distance/3|0;
			worker.postMessage({"imageData": imageData, "text": text, "height": ctx.canvas.height, "width": ctx.canvas.width, "distance": distance, "radius": radius});
		}

		function getType(param){
			return Object.prototype.toString.call(param).slice(8, -1);
		}

		var api = {
			"calculateText": function(text, width, height){
				if(getType(text) != "String")
					return;
				width = width || window.innerWidth;
				height = height || window.innerHeight;
				drawTextAndCalculate(text, width, height);
			}
		};

		return api;
	})();

	var drawAPI = (function(){
		function Shape(x, y, fillStyleString){
			this.x = x;
			this.y = y;
			this.fillStyleString = fillStyleString || "gray";
		}
		Shape.prototype = {
			"constructor": Shape,
			"setOffset": function(dx, dy){
				dx = Number(dx);
				dy = Number(dy);
				if(!dx || !dy)
					return;
				this.x += dx;
				this.y += dy;
			},
			"setFillStyle": function(fillStyleString){
				this.fillStyleString = String(fillStyleString);
			},
			"setCoords": function(x, y){
				this.x = Number(x);
				this.y = Number(y);
			}
		};

		var ctx,
			figures = [],
			shapes = [],
			currentPositions,
			currentDelay,
			drawCond = false,
			radius = 5,
			worker = new Worker("check-positions.js");

		function calculatePositionsOfShapesOnCircle(countOfShapes){
			var x0 = window.innerWidth/2|0,
				y0 = window.innerHeight/2|0,
				PI2 = Math.PI*2,
				distance = PI2/countOfShapes,
				radius = (x0 > y0 ? y0 : x0)-50,
				positions = [];
			for(var i=0; i<PI2; i+=distance){
				var x = x0+radius*Math.cos(i),
					y = y0+radius*Math.sin(i);
				positions.push([x, y]);
			}
			return positions;
		}

		function animate(){
			if(currentPositions || !figures.length)
				return;
			var currentFigure = figures.splice(0, 1)[0];
			currentDelay = currentFigure.delay;
			currentPositions = currentFigure.positions;
			radius = currentFigure.radius || 5;
			prepareShapes(currentPositions);
			if(!drawCond){
				drawCond = true;
				draw();
			}

			window.setTimeout(sendToCheckPositions, currentDelay);
		}

		function sendToCheckPositions(){
			worker.postMessage({"positions": currentPositions, "shapes": shapes});
		}

		worker.addEventListener("message", function(event){
			var data = event.data,
				checkPositionsCond = data.checkPositionsCond;
			changeAnimation(Number(checkPositionsCond));
		}, false);

		function changeAnimation(condPositions){
			if(condPositions == 1 && figures.length)
				window.setTimeout(function(){
					currentPositions = undefined;
					currentDelay = undefined;
					animate();
				}, 300);
			else if(condPositions == 1 && !figures.length)
				drawCond = false;
			else if(condPositions == 0)
				window.setTimeout(sendToCheckPositions, 1000);
		}

		function draw(){
			if(!drawCond){
				return;
			}
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			// ctx.shadowBlur = radius;
			for(var i=0; i<shapes.length; i++){
				ctx.save();
				var shape = shapes[i];

				if(currentPositions && currentDelay){
					var dx = (currentPositions[i][0] - shape.x)/(currentDelay/100|0),
					dy = (currentPositions[i][1] - shape.y)/(currentDelay/100|0);
					shape.setOffset(dx, dy);
				}

				ctx.fillStyle = shape.fillStyleString;
				ctx.beginPath();
				ctx.translate(shape.x, shape.y);
				ctx.arc(0, 0, radius, 0, Math.PI*2, false);
				if(shape.fillStyleString)
					ctx.shadowColor = shape.fillStyleString;
				ctx.fill();
				ctx.closePath();
				ctx.restore();
			}
			window.requestAnimationFrame(draw);
		}

		function prepareShapes(positions){
			shapes.length = positions.length;
			for(var i=0; i<shapes.length; i++){
				if(!(shapes[i] instanceof Shape)){
					var x = i>0 && shapes[0].x || positions[i][0],
						y = i>0 && shapes[0].y || positions[i][1];
					shapes[i] = new Shape(x, y, "rgb("+(0|(Math.random()*200))+", "+(0|(Math.random()*200))+", "+(0|(Math.random()*200))+")");
				}
			}
		}

		function getType(param){
			return Object.prototype.toString.call(param).slice(8, -1);
		}

		var api = {
			get ctx(){
				return ctx;
			},
			set ctx(param){
				if(param instanceof CanvasRenderingContext2D)
					ctx = param;
			},
			drawShapesInDelay: function(params, circleCond, delayCircleCond){
				var positions = params.positions,
					delay = params.delay && params.delay > 100 ? params.delay : 5000,
					radius = params.radius && Number(params.radius)>0 && Number(params.radius) || 5;
				if(!Array.isArray(positions) || getType(delay) != "Number" || !positions.length || !(ctx instanceof CanvasRenderingContext2D))
					return;
				if(circleCond){
					delayCircleCond = Number(delayCircleCond);
					delayCircleCond = delayCircleCond > 100 ? delayCircleCond : 5000;
					figures.push({"positions": calculatePositionsOfShapesOnCircle(positions.length), "delay": delayCircleCond});
				}
				figures.push({"positions": positions, "delay": delay, "radius": radius});
				animate();
			}
		};

		return api;
	})();

})();
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
