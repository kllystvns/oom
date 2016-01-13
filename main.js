OOM.MODE = 'css product';

(function() {

	window.oomVerse = new OOM.World({
		x0: -1000,
		x1: 1000,
		y0: -1000,
		y1: 1000,
		z0: 0,
		z1: -2000
	})
	oomVerse.init();
	oomVerse.render();

	var light = new THREE.AmbientLight(0x444444)
	oomVerse.scene.add(light)


	var geometry = new THREE.PlaneGeometry( 1000, 1000 );
	var material = new THREE.MeshBasicMaterial( {color: 0xaaaaff, opacity: 0.5, transparent: true, side: 2} );
	var plane = new THREE.Mesh( geometry, material );
	oomVerse.scene.add(plane)

	oomVerse.cube(600,600,600,-600,600, -301, 0xffff22);
	oomVerse.cube(600,600,600,600,600, -301, 0xffff22);
	oomVerse.cube(300,300,300, -300,0, 0, 0xffff22);

	oomVerse.add([
		new OOM.DOMObject({
			selector: '#a1',
			position: { x: -100, y: -100, z: -100 },
			rotation: { x: -0.5, y: -0.5, z: 0 },
			styles: {
				backgroundColor: 'red',
				opacity: '0.5'
			}
		}),
		new OOM.DOMObject({
			selector: '#a2',
			position: { x: 200, y: 0, z: 100 },
			rotation: { x: -0.5, y: -0.5, z: 0 },
			styles: {
				backgroundColor: 'red',
				opacity: '0.5'
			}
		})
	])
	
})();

(function() {

	window.oomPa = new OOM.Path(20, 200);
	oomPa.addSpline([
		{x: 500, y: 0, z: 0},
		{x: 0, y: 0, z: 0},
		{x: -180, y: 180, z: 0},
		{x: -260, y: 180, z: -140},
		{x: -500, y: -100, z: -300},
		{x: -500, y: -50, z: -600},
		{x: 0, y: 0, z: -200}
	]);
	
})();

(function() {

	window.oomer = new OOM.Controller( oomVerse, oomPa, {} );

	oomer.init();

})();


//////////////////////////////////////

// var cssCanvas = document.createElement('div');
// cssCanvas.setAttribute('class', 'canvas');
// document.body.appendChild( cssCanvas );

// cssCanvas.style.transform = 'perspective(1300px) scale(1)'

// var cssRoot = document.createElement('div');
// cssRoot.setAttribute('class', 'root');
// cssCanvas.appendChild( cssRoot );

// cssRoot.style.transform = 'translate3d(0px,0px,-1300px)'

// cub3d([

// 	{
// 		attributes: {
// 			origin: [-450, -150, -150],
// 			dimensions: [300, 300, 300],
// 			rotation: [0, 0, 0],
// 			id: 'function-cube'
// 		},
// 		styles: {
// 			background: 'red',
// 			opacity: '0.3'
// 		},
// 		html: {
// 			face1A: '<p>function(</p>',
// 			face1B: '<p>&nbsp;function()</p>',
// 			face2A: '<p>function){</p>',
// 			face2B: '<p>}</p>',
// 			face3A: '<p></p>',
// 			face3B: '<p></p>'
// 		}		
// 	}

// ], '.root');



