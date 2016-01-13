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

// GLOBAL VARIABLES

OOM.MODE = 'css product';
// possible values for mode: 'combined sketch', 'combined product', 'css sketch', 'css product'


// WORLD /////////////////////////////////////////
//////////////////////////////////////////////////
// emcompasses elements of THREEjs environment ///
// including scene, camera, renderer /////////////
//////////////////////////////////////////////////

OOM.World = function(worldDimensions) {

	this.dimensions = worldDimensions;
	// {x0: *, x1: *, y0: *, y1: *, z0: *, z1: *}

	this.scene = new THREE.Scene();

}
OOM.World.prototype = {

	init: function() {

		if ( OOM.MODE.search(/combined/) > -1 ) {

			var light1 = new THREE.DirectionalLight(0xffffff, 0.7);
			light1.position.set(0.7,0.7,1);
			this.scene.add(light1);
			var light2 = new THREE.DirectionalLight(0xffffff, 0.2);
			light2.position.set(-1,-0.3,-0.1);
			this.scene.add(light2);
			var light3 = new THREE.AmbientLight( 0x333333 );
			this.scene.add(light3);

			this.webGLRenderer = new THREE.WebGLRenderer();
			this.webGLRenderer.setClearColor( 0xffffff );
			this.webGLRenderer.setSize(window.innerWidth, window.innerHeight);
			document.body.appendChild(this.webGLRenderer.domElement)
			
		}

		this.overviewCamera = new OOM.OverviewCamera(this.dimensions);
		this.camera = this.overviewCamera;

		this.cssRenderer = new THREE.CSS3DRenderer();
		this.cssRenderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( this.cssRenderer.domElement );

		return this;

	},

	render: function() {

		!this.renderLoopId ? this.renderLoopId = 0 : null;

		var unboundFunc = (function(id) {
			return function() {

				if (this.renderLoopId === id) {
					requestAnimationFrame( renderLoop );

					if ( this.webGLRenderer ) {

						this.webGLRenderer.render( this.scene, this.camera );
						
					}

					this.cssRenderer.render( this.scene, this.camera );
				
				}

			}
		})(this.renderLoopId);
		var renderLoop = unboundFunc.bind(this);

		renderLoop();

	},

	stopRender: function() {

		this.renderLoopId++

	},

	setCSSRenderInterval: function( interval ) {

		this.cssRenderer.domElement.style.transition = 'perspective ' + ( interval / 1000 ) + 's ease';
		this.cssRenderer.domElement.firstChild.style.transition = 'transform ' + ( interval / 1000 ) + 's ease';

	},

	overview: function(direction) {

		this.camera = this.overviewCamera;

		this.overviewCamera.lookFrom(direction, this.dimensions);

	},

	viewPath: function() {

		this.camera = this.pathCamera;

	},

	cube: function( w, h, d, x, y, z, color ) {

		var geometry = new THREE.BoxGeometry( w, h, d );
		var material = new THREE.MeshLambertMaterial( { color: color } );
		var cube = new THREE.Mesh( geometry, material );
		cube.translateX(x);
		cube.translateY(y);
		cube.translateZ(z);
		this.scene.add(cube);

	},

	// options: styles, position, rotation
	div: function( options ) {

		this.scene.add( new OOM.Div( options ) );

	},

	add: function( objects ) {

		if ( !( objects instanceof Array ) ) {

			objects = [ objects ];

		}

		for ( var i = 0; i < objects.length; i++ ) {

			this.scene.add( objects[i] );

		}

	}

}


// OVERVIEW CAMERA /////////////////////////////
////////////////////////////////////////////////
// for viewing full 3d setting in development //
////////////////////////////////////////////////

OOM.OverviewCamera = function( worldDimensions ) {
// not necessary to make new class ?

	THREE.PerspectiveCamera.call(this, 75, window.innerWidth/window.innerHeight, 0.1, 5000);

	this.lookFrom('front', worldDimensions);

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




OOM.DOMObject = function( options ) {

	var element = document.querySelector( options.selector );

	THREE.CSS3DObject.call( this, element );

	this.position.set( options.position.x, options.position.y, options.position.z );

	this.rotation.set( options.rotation.x || 0, options.rotation.y || 0, options.rotation.z || 0 );

	this.restyle( options.styles );

	if ( !this.element.classList.contains('oom') ) {

		this.element.classList.add('oom');

	}

}
OOM.DOMObject.prototype = Object.create( THREE.CSS3DObject.prototype );
OOM.DOMObject.prototype.constructor = OOM.DOMObject;

OOM.DOMObject.prototype.restyle = function( styles ) {

	for ( style in styles ) {

		this.element.style[style] = styles[style];

	}

}




// PATH ////////////////////////////////////////
////////////////////////////////////////////////
// controls camera motion along trajectory /////
// calculated byt THREEjs //////////////////////
////////////////////////////////////////////////


OOM.Path = function(distanceInterval, viewDistance) {

	THREE.CurvePath.call(this);

	this.interval = distanceInterval;
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

	var geometry = this.createSpacedPointsGeometry(200);
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

	this.setPosition( this.arcPosition );
	
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



OOM.PathCamera = function( fov ) {

	fov = fov || 75;

	THREE.PerspectiveCamera.call(this, fov, window.innerWidth/window.innerHeight, 0.5, 5000);

}
OOM.PathCamera.prototype = Object.create(THREE.PerspectiveCamera.prototype);
OOM.PathCamera.prototype.constructor = OOM.PathCamera;

OOM.PathCamera.prototype.setPosition = function( position ) {

	this.position.set( position.x, position.y, position.z );

}



// CONTROLLER ////////////////////////////////////
//////////////////////////////////////////////////
// controls user interface actions for movement //
//////////////////////////////////////////////////

OOM.Controller = function(world, path, options) {

	this.world = world;

	this.path = path;

	this.world.pathCamera = this.path.camera;

	this.scrollState = {
		curr: 0,
		prev: 0
	};

	this.scrollThreshold = options.scrollThreshold || 30;

	this.timeInterval = options.timeInterval || 100;
	this.world.setCSSRenderInterval( this.timeInterval );

	this.animationReady = true;

}
OOM.Controller.prototype = {

	init: function() {

		this.exceptScrollable();

		var scrollThis = this.onScroll.bind( this );
		window.addEventListener( 'wheel', scrollThis );

		var resizeThis = this.onResize.bind( this );
		window.addEventListener( 'resize', resizeThis );

		this.viewPath();

		if ( OOM.MODE.search(/sketch/) > -1 ) {

			this.world.scene.add( this.path.displayLine );
		
		}

		return this;

	},

	viewPath: function() {

		this.world.viewPath();

	},

	viewWorld: function() {

		this.world.camera = this.world.overviewCamera;

	},

	exceptScrollable: function() {

		var scrolls = document.querySelectorAll('.scrollable');

		for ( var i = 0; i < scrolls.length; i++ ) {

			scrolls[i].addEventListener('wheel', function(e) { 

				e.stopPropagation();

			});

		}

	},

	onScroll: function( event ) {

		event.preventDefault();

		this.scrollState.curr += -event.wheelDeltaY / 3;

		this.update();

	},

	onResize: function() {

		// this.world.overviewCamera.aspect = window.innerWidth / window.innerHeight;
		// this.world.pathCamera.aspect = window.innerWidth / window.innerHeight;

		// this.world.webGLRenderer.setSize( window.innerWidth, window.innerHeight);
		// this.world.cssRenderer.setSize( window.innerWidth, window.innerHeight);

	},

	update: function() {

	// NEED TO DECIDE whether to throttle animation
		if ( true || this.animationReady === true ) {

			if ( this.scrollState.curr - this.scrollState.prev > this.scrollThreshold ) {

				this.animationReady = false;

				this.scrollState.prev = this.scrollState.curr;

				this.path.goForward();

				this.animationCount( this );

			} else if ( this.scrollState.prev - this.scrollState.curr > this.scrollThreshold ) {

				this.animationReady = false;

				this.scrollState.prev = this.scrollState.curr;

				this.path.goBack();

				this.animationCount( this );				

			}
			
		}

	},

	animationCount: function( thisObj ) {

		setTimeout( function() {

			thisObj.animationReady = true;

		}, this.timeInterval );

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

