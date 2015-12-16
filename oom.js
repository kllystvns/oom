//- PARAMETERS (APP INPUTS)

//- WORLD PARAMETERS
//--- world dimenions {x0,x1,y0,y1,z0,z1}

//- OBJECT PARAMETERS
//--- object dimensions
//--- object rotation

//- PATH PARAMETERS
//--- path spline points

if (!Math.square) {

	Math.square = function(num) {
		return num * num;
	}

}

var OOM = {};


// WORLD /////////////////////////////////////////
//////////////////////////////////////////////////
// emcompasses elements of THREEjs environment ///
// including scene, camera, renderer /////////////
//////////////////////////////////////////////////

OOM.World = function(worldDimensions) {

	this.dimensions = worldDimensions;

	return this

}
OOM.World.prototype = {

	initSketchMode: function() {

		this.mode = 'sketch overview';

		this.scene = new THREE.Scene();

		var light1 = new THREE.DirectionalLight(0xffffff, 0.7);
		light1.position.set(0.7,0.7,1);
		this.scene.add(light1);
		var light2 = new THREE.DirectionalLight(0xffffff, 0.2);
		light2.position.set(-1,-0.3,-0.1);
		this.scene.add(light2);
		var light3 = new THREE.AmbientLight(0x333333);
		this.scene.add(light3);

		// var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
		// directionalLight.position.set( 0.3, 1, 1 );

		this.overviewCamera = new OOM.OverviewCamera(this.dimensions);
		this.camera = this.overviewCamera;

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement)

	},

	initProductMode: function() {},

	render: function() {

		!this.renderLoopId ? this.renderLoopId = 0 : null;

		var unboundFunc = (function(id) {
			return function() {

				if (this.renderLoopId === id) {
					requestAnimationFrame(renderLoop);
					this.renderer.render(this.scene, this.camera);
				}

			}
		})(this.renderLoopId);
		var renderLoop = unboundFunc.bind(this);

		renderLoop();

	},

	stopRender: function() {

		this.renderLoopId++

	},

	cube: function(w,h,d,x,y,z,color) {

		var geometry = new THREE.BoxGeometry( w, h, d );
		var material = new THREE.MeshLambertMaterial( { color: color } );
		var cube = new THREE.Mesh( geometry, material );
		cube.translateX(x);
		cube.translateY(y);
		cube.translateZ(z);
		this.scene.add(cube);

	},

	overview: function(direction) {

		this.overviewCamera.lookFrom(direction, this.dimensions);
		
		if (this.mode !== 'sketch overview') {
			this.mode = 'sketch overview';
			this.camera = this.overviewCamera;
		} 

	},

	viewPath: function() {

		this.camera = this.pathCamera;

	}

}


// OVERVIEW CAMERA /////////////////////////////
////////////////////////////////////////////////
// for viewing full 3d setting in development //
////////////////////////////////////////////////

OOM.OverviewCamera = function(worldDimensions) {
// not necessary to make new class ?

	THREE.PerspectiveCamera.call(this, 75, window.innerWidth/window.innerHeight, 0.1, 5000);

	this.lookFrom('front', worldDimensions);

	return this;

}
OOM.OverviewCamera.prototype = Object.create(THREE.PerspectiveCamera.prototype);
OOM.OverviewCamera.prototype.constructor = OOM.OverviewCamera;

OOM.OverviewCamera.prototype.lookFrom = function(direction, worldDimensions) {

	var wd = worldDimensions;
	var zPlaneWidth = Math.square(wd.x1 - wd.x0) > Math.square(wd.y1 - wd.y0) ? wd.x1 - wd.x0 : wd.y1 - wd.y0;
	var xPlaneWidth = Math.square(wd.z1 - wd.z0) > Math.square(wd.y1 - wd.y0) ? wd.z1 - wd.z0 : wd.y1 - wd.y0;
	var yPlaneWidth = Math.square(wd.x1 - wd.x0) > Math.square(wd.z1 - wd.z0) ? wd.x1 - wd.x0 : wd.z1 - wd.z0;

	switch (direction) {
		case 'front':
			this.position.set(0, 0, 0);
			this.position.z = wd.z0 + (zPlaneWidth * 0.68);
			
			this.rotation.set(0, 0, 0);
			break;
		case 'back':
			this.position.set(0, 0, 0);
			this.position.z = wd.z1 - (zPlaneWidth * 0.68);
			
			this.rotation.set(0, Math.PI, 0);
			break;
		case 'right':
			this.position.y = 0;
			this.position.z = wd.z1 + (zPlaneWidth / 2);
			this.position.x = wd.x1 + (xPlaneWidth * 0.68);
			
			this.rotation.set(0, Math.PI / 2, 0);
			break;
		case 'left':
			this.position.y = 0;
			this.position.z = wd.z1 + (zPlaneWidth / 2);
			this.position.x = wd.x0 - (xPlaneWidth * 0.68);
			
			this.rotation.set(0, -(Math.PI / 2), 0);
			break;
	}

}



// PATH ////////////////////////////////////////
////////////////////////////////////////////////
// controls camera motion along trajectory /////
// calculated byt THREEjs //////////////////////
////////////////////////////////////////////////


OOM.Path = function(interval, viewDistance) {

	THREE.CurvePath.call(this);

	this.interval = interval;
	this.uInterval = null;

	this.viewDistance = viewDistance;

	this.position = new THREE.Vector3();

	this.arcPosition = 0;

	this.points = [];

	this.camera = new OOM.PathCamera();

}
OOM.Path.prototype = Object.create(THREE.CurvePath.prototype);
OOM.Path.prototype.constructor = OOM.Path;

OOM.Path.prototype.display = function() {

	var geometry = this.createSpacedPointsGeometry(100);
	var material = new THREE.LineBasicMaterial( { color : 0x00fff0 } );
	this.displayLine = new THREE.Line( geometry, material );

}
OOM.Path.prototype.addSpline = function(pointsArray) {

	for (var i = 0; i < pointsArray.length; i++) {
		var x = pointsArray[i].x;
		var y = pointsArray[i].y;
		var z = pointsArray[i].z;
		pointsArray[i] = new THREE.Vector3(x, y, z);
	}

	var spline = new THREE.CatmullRomCurve3(pointsArray);

	this.add(spline);

	this.recalculate();

}
OOM.Path.prototype.recalculate = function() {

	this.length = this.getLength();

	this.uInterval = this.interval / this.length;

	this.display();

}
OOM.Path.prototype.setPosition = function( u ) {

	this.position = this.getPointAt( u );

	var cameraVector = this.getProjectionLine();

	this.camera.setPosition( cameraVector );
	this.camera.lookAt( this.position );

}
OOM.Path.prototype.getProjectionLine = function() {

	var tangentLine = this.getTangentAt( this.arcPosition );

	tangentLine.multiplyScalar( -this.viewDistance );

	return tangentLine.add( this.position );

}
OOM.Path.prototype.goForward = function() {

	this.arcPosition += this.uInterval;
	this.arcPosition > 1 ? this.arcPosition = 0 : null;

	this.setPosition( this.arcPosition ); 

}
OOM.Path.prototype.goBack = function() {

	this.arcPosition -= this.uInterval;
	this.arcPosition < 0 ? this.arcPosition = 1 : null;

	this.setPosition( this.arcPosition ); 

}



OOM.PathCamera = function() {

	THREE.PerspectiveCamera.call(this, 75, window.innerWidth/window.innerHeight, 0.1, 5000);

	return this;

}
OOM.PathCamera.prototype = Object.create(THREE.PerspectiveCamera.prototype);
OOM.PathCamera.prototype.constructor = OOM.PathCamera;

OOM.PathCamera.prototype.setPosition = function( position ) {

	this.position.set( position.x, position.y, position.z );

}



// FRAME /////////////////////////////////////////
//////////////////////////////////////////////////
// controls user interface actions for movement //
//////////////////////////////////////////////////

// name doesnt make sense if doesnt have camera
OOM.Frame = function(world, path, options) {

	this.world = world;

	this.path = path;

	this.scrollState = {

		curr: 0,
		prev: 0

	};

	this.threshold = options.threshold || 30;

	this.animationReady = true;

}
OOM.Frame.prototype = {

	initSketchMode: function() {

		var preventDefault = function( event ) {
			event.preventDefault();
		}
		window.addEventListener( 'wheel', preventDefault );

		var scrollThis = this.onScroll.bind( this )

		window.addEventListener( 'wheel', scrollThis );

		this.world.pathCamera = this.path.camera;

		this.world.scene.add( this.path.displayLine );

	},

	initProductMode: function() {

		var preventDefault = function( event ) {
			event.preventDefault();
		}
		window.addEventListener( 'wheel', preventDefault );

	},

	viewPath: function() {

		this.world.viewPath();

	},

	viewWorld: function() {

		this.world.camera = this.world.overviewCamera;

	},

	onScroll: function( event ) {

		this.scrollState.curr += -event.wheelDeltaY / 3;

		this.update();

	},

	update: function() {

	// NEED TO DECIDE whether to throttle animation
		if ( true || this.animationReady === true ) {

			if ( this.scrollState.curr - this.scrollState.prev > this.threshold ) {

				this.animationReady = false;

				this.scrollState.prev = this.scrollState.curr;

				this.path.goForward();

				var thisObj = this;
				this.animationCount( this );

			} else if ( this.scrollState.prev - this.scrollState.curr > this.threshold ) {

				this.animationReady = false;

				this.scrollState.prev = this.scrollState.curr;

				this.path.goBack();

				var thisObj = this;
				this.animationCount( this );				

			}
			
		}

	},

	animationCount: function( thisObj ) {

		setTimeout( function() {

			thisObj.animationReady = true;

		}, 200);

	},

}












// function ScrollState() {
// 	this.wheel = {
// 		curr: 0,
// 		prev: 0
// 	};
// }
// ScrollState.prototype.init = function() {
// 	function onSwipe(caller) {
// 		return function(event) {
// 			caller.wheel.curr += event.wheelDeltaY / 3 ;
// 		}
// 	} 
// 	window.addEventListener('wheel', onSwipe(this))

// 	function animate() {
// 		var deltaY = this.wheel.curr - this.wheel.prev;
// 		var newPosition = window.scrollY - deltaY;
// 		this.wheel.prev = this.wheel.curr;
// 		window.scrollTo(0, newPosition);
// 	}

// 	this.animate = animate.bind(this);
// }


// function preventDefault(event) {
// 	event.preventDefault();
// }
// window.addEventListener('wheel', preventDefault);

// var scrollState = new ScrollState();
// scrollState.init();
// animateInt = setInterval(scrollState.animate, 200);

