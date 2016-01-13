// GENERATE CSS PERSPECTIVE CUBES WITH DIVS


function Cube(data, rootElement) {
// attributes are: id, origin, dimensions, rotation
	var attributes = data.attributes;
	this.styles = data.styles || {};
	this.id = attributes.id;
	this.div = document.createElement('div');
	var root = document.querySelector( rootElement );
	console.log(root)
	root.appendChild(this.div);
	this.div.setAttribute('id', this.id);
	this.div.setAttribute('class', 'cube');
	
	this.html = data.html;
	this.div.innerHTML = this.template(this.html);

	this.origin = {
		x: attributes.origin[0],
		y: attributes.origin[1],
		z: attributes.origin[2]
	};
	this.dimensions = {
		width: attributes.dimensions[0],
		height: attributes.dimensions[1],
		depth: attributes.dimensions[2]
	};
	this.rotation = {
		x: attributes.rotation[0],
		y: attributes.rotation[1],
		z: attributes.rotation[2]
	};

	// LOOP TO CREATE 6 FACES OF CUBE
	this.faces = [];
	var d;
	var o;
	var r;
	var id;
	for (var i = 0; i < 6; i++) {
		d = [this.dimensions.width, this.dimensions.height];
		o = [this.origin.x, this.origin.y, this.origin.z];
		r = [this.rotation.x, this.rotation.y, this.rotation.z];
		id = [this.id, null];
	// Each of the cube's six faces is identified
	// by one of the following [1A, 1B, 2A, 2B, 3A, 3B]
	// 1A is across from 1B, etc
	// Their geometric properties are specifically determined
		switch (i) {
			case 0:
				id[1] = 'face1A';
				d[1] = this.dimensions.depth;
				r[0] = this.rotation.x + 90;
				break;
			case 1:
				id[1] = 'face1B';
				d[1] = this.dimensions.depth;
				o[1] = this.origin.y + this.dimensions.height;
				r[0] = this.rotation.x + 90;
				break;
			case 2:
				id[1] = 'face2A';
				o[2] = this.origin.z + this.dimensions.depth;
				break;
			case 3:
				id[1] = 'face2B';
				break;
			case 4:
				id[1] = 'face3A';
				d[0] = this.dimensions.depth;
				r[1] = this.rotation.y - 90;
				break;
			case 5:
				id[1] = 'face3B';
				d[0] = this.dimensions.depth;
				o[0] = this.origin.x + this.dimensions.width;
				r[1] = this.rotation.y - 90;
				break;
		}
		var attrs = {
			dimensions: d,
			origin: o,
			rotation: r,
			id: id
		}		

		var face = new Face(attrs);
		this.faces.push(face);
		face.render();
		face.restyle(this.styles);
		// document.querySelector('#impress').firstChild.appendChild(face.div);
	}
	// END LOOP
}
Cube.prototype.render = function() {
	this.faces.forEach(function(e) {
		e.render();
	});
}
Cube.prototype.template = function(html) {
	var htmlArray = [];
	for (id in html) {
		elem  = '<div class="' + id + '">'
				  +		'<div class="spacer"></div>'
			    + 		html[id]
					+		'<div class="spacer"></div>'
				  + '</div>'
		htmlArray.push(elem);
	}
	return htmlArray.join('');
}

function Face(attributes) {
	// console.log(origin, dimensions, rotation, id)
	this.id = attributes.id;
	this.div = document.querySelector('#' + this.id[0] + ' .' + this.id[1]);
	this.div.classList.add('face');

	this.origin = {
		x: attributes.origin[0],
		y: attributes.origin[1],
		z: attributes.origin[2]
	};
	this.dimensions = {
		width: attributes.dimensions[0],
		height: attributes.dimensions[1]
	};
	this.rotation = {
		x: attributes.rotation[0],
		y: attributes.rotation[1],
		z: attributes.rotation[2]
	};
}
Face.prototype.render = function() {
	this.div.style.position = 'absolute';
	this.div.style.transformStyle = 'preserve-3d';
	this.div.style.width = this.dimensions.width + 'px';
	this.div.style.height = this.dimensions.height + 'px';
	var t = 'translate3d(' + this.origin.x + 'px,' + this.origin.y + 'px,' + this.origin.z + 'px)';
	var r = ' rotateX(' + this.rotation.x + 'deg) rotateY(' + this.rotation.y + 'deg) rotateZ(' + this.rotation.z + 'deg)';
	this.div.style.transformOrigin = '0% 0% 0';
	this.div.style.webkitTransformOrigin = '0% 0% 0';
	this.div.style.transform = t + r;
	this.div.style.webkitTransform = t + r;

};
Face.prototype.restyle = function(styles) {
	for (prop in styles) {
		this.div.style[prop] = styles[prop];
	}
}


// FUNCTION FOR CREATING ARRAY OF CUBES
var cub3ray = function(attributes) {
	// attributes: initial, final, numberOfCubes, dimensions, styles, arcCenter
	var cubesData = [];
	var numberOfCubes = attributes.numberOfCubes;
	
	var initialCube = {};
	initialCube.point = {
		x: attributes.initial[0],
		y: attributes.initial[1],
		z: attributes.initial[2]
	};
	var finalCube = {};
	finalCube.point = {
		x: attributes.final[0],
		y: attributes.final[1],
		z: attributes.final[2]
	} 
	var arcCenter = {
		x: attributes.arcCenter[0],
		y: attributes.arcCenter[1],
		z: attributes.arcCenter[2]
	}

	// difference between initial and final position
	var d = {}
	d.position = {
		x: {},
		y: {},
		z: {}
	};
	for (axis in d.position) {
		d.position[axis].cumulative = finalCube.point[axis] - initialCube.point[axis];
		d.position[axis].incremental = d.position[axis].cumulative / (numberOfCubes + 1);
	}

	var vecData1 = {
		initial: arcCenter,
		terminal: initialCube.point
	}
	initialCube.vector = new Vector(vecData1);
	var vecData2 = {
		initial: arcCenter,
		terminal: finalCube.point
	}
	finalCube.vector = new Vector(vecData2);

	d.magnitude = {};
	d.magnitude.cum = finalCube.vector.getMagnitude() - initialCube.vector.getMagnitude();
	d.magnitude.inc = d.magnitude.cum / (numberOfCubes + 1);

	// helper function 
	var randomize = function() {
		return 130 - (Math.random() * 260);
	}

//~~ GENERATE DATA FOR EACH CUBE IN 'ARRAY'	~~
//~~ GENERATE DATA FOR EACH CUBE IN 'ARRAY' ~~
	var cubeData;
	var currentVector;
	var currentMagnitude;
	var targetMagnitude;
	var scalar;
	var originBasis;
	var origin;
	var initMag = initialCube.vector.getMagnitude();
	for (var i = 0; i < attributes.numberOfCubes; i++) {
		// Array(verb) the cubes along path 
		// from initial to final point
		originBasis = {
			x: initialCube.point.x + (d.position.x.incremental * (i + 1)),
			y: initialCube.point.y + (d.position.y.incremental * (i + 1)),
			z: initialCube.point.z + (d.position.z.incremental * (i + 1))
		};
		// Scale distances of cubes from arc center
		// to follow arc path
		currentVector = new Vector({initial: arcCenter, terminal: originBasis});
		currentMagnitude = currentVector.getMagnitude();
		targetMagnitude = initMag + (d.magnitude.inc * (i + 1));
		currentVector.setMagnitude(targetMagnitude);
		origin = currentVector.addToPoint(arcCenter);

		for (axis in origin) {
			origin[axis] += randomize();
		}
		cubeData = {
			attributes: {
				origin: [origin.x, origin.y, origin.z],
				dimensions: attributes.dimensions,
				rotation: [0, 0, 0],
				id: 'array-cube-' + i
			},
			styles: attributes.styles,
			html: {
				face1A: '<p>' + i + '</p>',
				face1B: '<p>' + i + '</p>',
				face2A: '<p>' + i + '</p>',
				face2B: '<p>' + i + '</p>',
				face3A: '<p>' + i + '</p>',
				face3B: '<p>' + i + '</p>'
			}		
		}
		cubesData.push(cubeData);
	}
	return cubesData;
}
function Vector(data) {
	this.coordinates = {}
	// data: initial point, terminal point
	for (axis in data.initial) {
		this.coordinates[axis] = data.terminal[axis] - data.initial[axis];
	}
}
Vector.prototype.getMagnitude = function() {
	var c = this.coordinates;
	return Math.sqrt( Math.pow(c.x, 2) + Math.pow(c.y, 2) + Math.pow(c.z, 2) );
}
Vector.prototype.setMagnitude = function(targetMagnitude) {
	var currMag = this.getMagnitude();
	var scalar = targetMagnitude / currMag;
	for (axis in this.coordinates) {
		this.coordinates[axis] *= scalar;
	}
}
Vector.prototype.addToPoint = function(point) {
	var newPoint = {}
	for (axis in this.coordinates) {
		newPoint[axis] = point[axis] + this.coordinates[axis];
	}
	return newPoint;
}


// Initialize function using data module
// of all your desired cubes
var cub3d = function(dataModule, rootElement) {
	window.cubes = [];

	for (var i = 0; i < dataModule.length; i++) {
		window.cubes.push(new Cube(dataModule[i], rootElement));
	}
}