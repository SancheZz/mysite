"use strict";
this.addEventListener("message", function(event){
	var data = event.data,
		pixels = data.imageData.data,
		height = data.imageData.height || data.height,
		width = data.imageData.width || data.width,
		text = data.text,
		positions = [],
		radius = data.radius;

	distance = data.distance || 17;

	for(var i=0; i<height; i++){
		for(var j=0; j<width; j++){
			var opacityPoint = pixels[width*i*4+j*4+3];
			if(opacityPoint == 0)
				continue;
			var currentPoint = [j, i];
			if(positions.every(checkPositions, currentPoint))
				positions.push(currentPoint);
		}
	}

	this.postMessage({"positions": positions, "text": text, "radius": radius, "distance": distance});
}, false);

var distance = 17;

function checkPositions(element){
	return Math.abs(element[0]-this[0]) > distance || Math.abs(element[1]-this[1]) > distance;
}
