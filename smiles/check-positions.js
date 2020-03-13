"use strict";
this.addEventListener("message", function(event){
	var data = event.data,
		positions = data.positions,
		shapes = data.shapes;

	this.postMessage({"checkPositionsCond": checkPositions(positions, shapes)});
}, false);

function checkPositions(positions, shapes){
	return positions.every(isEqualCoords, shapes);
}

function isEqualCoords(element, index, array){
	return ((element[0]-this[index].x)|0)==0 && ((element[1]-this[index].y)|0)==0;
}
