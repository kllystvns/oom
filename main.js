var oomWorld = new OOM.World({
	x0: -1000,
	x1: 1000,
	y0: -1000,
	y1: 1000,
	z0: 0,
	z1: -2000
})
oomWorld.initSketchMode();
oomWorld.render();

var light = new THREE.AmbientLight(0x444444)
oomWorld.scene.add(light)


var geometry = new THREE.PlaneGeometry( 1000, 1000 );
var material = new THREE.MeshBasicMaterial( {color: 0xaaaaff, opacity: 0.5, transparent: true, side: 2} );
var plane = new THREE.Mesh( geometry, material );
oomWorld.scene.add(plane)

oomWorld.cube(600,600,600,-600,600, -301, 0xffff22);
oomWorld.cube(600,600,600,600,600, -301, 0xffff22);

var path = new OOM.Path();
path.addSpline([
	{x: 0, y: 0, z: 0},
	{x: -1000, y: 30, z: -50},
	{x: 0, y: 0, z: -2000},
]);
path.display();
oomWorld.scene.add(path.displayLine);


// var curve = new OOM.SplineSegment([
// 	{x: -200, y: 0, z: 0},
// 	{x: -100, y: 50, z: 50},
// 	{x: 0, y: 30, z: 0},
// 	{x: 100, y: 0, z: 200},
// 	{x: 200, y: -60, z: 0}
// ]);

// var pt = curve.curve.getPointAt(0.6)
// var vec = curve.curve.getTangentAt(0.6)
// for (axis in vec) {
// 	if (['x','y','z'].indexOf(axis) > -1) {
// 		vec[axis] *= 100
// 	}
// }

// var geometry = new THREE.Geometry();
// geometry.vertices = [new THREE.Vector3(), vec];
// geometry.translate(pt.x, pt.y, pt.z)

// var material = new THREE.LineBasicMaterial( { color : 0x00fff0 } );

// var point = new THREE.Line( geometry, material );
// elements.push(point)


// var curve = new OOM.SplineSegment([
// 	{x: -200, y: 0, z: 0},
// 	{x: -100, y: 50, z: 50},
// 	{x: 0, y: 30, z: -100},
// 	{x: 100, y: 0, z: 200},
// 	{x: 200, y: -60, z: 0}
// ]);

// var geometry = new THREE.Geometry();
// geometry.vertices = curve.curve.getPoints( 50 );

// var material = new THREE.LineBasicMaterial( { color : 0xff00f0 } );

// var curveObject = new THREE.Line( geometry, material );




// elements.push(curveObject);

// elements.push(light);


// 			var geometry = new THREE.BoxGeometry( 100, 100, 100 );
// 			var material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
// 			var cube2 = new THREE.Mesh( geometry, material );
// 			cube2.position.y = 200;
// 			cube2.rotateZ(1)
// 			cube2.rotateX(0.5)
// 			elements.push(cube2)

// 			var geometry = new THREE.BoxGeometry( 100, 100, 100 );
// 			var material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
// 			var cube = new THREE.Mesh( geometry, material );
// 			cube.position.y = -200;
// 			cube.rotateZ(-1)
// 			cube.rotateX(-0.5)
// 			elements.push(cube)

// var arc = new THREE.EllipseCurve(
// 	0,0,
// 	20,20,
// 	0,2 * Math.PI,
// 	false,
// 	0
// )
// var path = new THREE.Path(arc.getPoints(30))
// var geometry = path.createPointsGeometry()
// var material = new THREE.LineBasicMaterial({color: 0xff0000, linewidth: 1})
// var ellipse = new THREE.Line(geometry, material)
// elements.push(ellipse);


// var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
// directionalLight.position.set( 0.3, 1, 1 );
// elements.push( directionalLight );

// var initialize = function(elements) {
// 	window.scene = new THREE.Scene();
// 	window.camera = window.camera1 = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
// 	camera.position.z = 680;

// 	for (var i=0; i < elements.length; i++) {
// 		scene.add(elements[i]);
// 	}
// 	// scene.rotateX(-0.74)
// 	// scene.rotateY(-0.75)
// 	// scene.rotateZ(0.75)
// }

// var framerender = function() {
// 	window.renderer = new THREE.WebGLRenderer();
// 	renderer.setSize(window.innerWidth, window.innerHeight);
// 	// renderer.setClearColor(0xffffff)
// 	document.body.appendChild(renderer.domElement);

// 	var render = function() {
// 		requestAnimationFrame(render);
// 		renderer.render(scene, camera);
// 		// scene.rotateX(0.01);

// 	}

// 	render();
// }

// initialize(elements);
// framerender();

// document.body.style.height = '10000px'
// var div = document.querySelector('div');
// var newDiv
// for (var i = 0; i < 100; i++) {
// 	newDiv = document.createElement('div');
// 	newDiv.textContent = div.textContent;
// 	document.body.appendChild(newDiv);
// }
