/* global THREE */
/* global performance */


var bookmarks = [
	{
		url: 'bbc.com'
	},

	{
		url: 'drive.google.com'
	},

	{
		url: 'facebook.com'
	},

	{
		url: 'google.com'
	},

	{
		url: 'live.com'
	},

	{
		url: 'netflix.com'
	},

	{
		url: 'qq.com'
	},

	{
		url: 'sina.com.cn'
	},

	{
		url: 'tumblr.com'
	},

	{
		url: 'vox.com'
	},

	{
		url: 'wordpress.com'
	},

	{
		url: 'yahoo.com'
	},

	{
		url: 'amazon.com'
	},

	{
		url: 'bing.com'
	},

	{
		url: 'dropbox.com'
	},

	{
		url: 'firewatchgame.com'
	},

	{
		url: 'huffingtonpost.com'
	},

	{
		url: 'mail.google.com'
	},

	{
		url: 'nytimes.com'
	},

	{
		url: 'quizlet.com'
	},

	{
		url: 'taobao.com'
	},

	{
		url: 'twitter.com'
	},

	{
		url: 'weibo.com'
	},

	{
		url: 'wordpress.org'
	},

	{
		url: 'yelp.com'
	},

	{
		url: 'baidu.com'
	},

	{
		url: 'buzzfeed.com'
	},

	{
		url: 'economist.com'
	},

	{
		url: 'github.com'
	},

	{
		url: 'linkedin.com'
	},

	{
		url: 'medium.com'
	},

	{
		url: 'pinterest.com'
	},

	{
		url: 'qz.com'
	},

	{
		url: 'tmall.com'
	},

	{
		url: 'vimeo.com'
	},

	{
		url: 'wikipedia.org'
	},

	{
		url: 'yahoo.co.jp'
	},
	{
		url: 'youtube.com'
	}
];

var camera, scene, renderer;
var geometry, material, mesh;
var controls, canJump;
var controlsEnabled = false;

var objects = [];

var raycaster;

var instructions = document.body;

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if (havePointerLock) {

	var element = document.body;

	var pointerlockchange = function(event) {

		if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {

			controlsEnabled = true;
			controls.enabled = true;

		} else {

			controls.enabled = false;
		}

	};

	var pointerlockerror = function(event) {
		console.log('Pointer lock error', event);
	};

	// Hook pointer lock state change events
	document.addEventListener('pointerlockchange', pointerlockchange, false);
	document.addEventListener('mozpointerlockchange', pointerlockchange, false);
	document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

	document.addEventListener('pointerlockerror', pointerlockerror, false);
	document.addEventListener('mozpointerlockerror', pointerlockerror, false);
	document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

	instructions.addEventListener('click', function(event) {
		// Ask the browser to lock the pointer
		element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

		if (/Firefox/i.test(navigator.userAgent)) {

			var fullscreenchange = function(event) {

				if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {

					document.removeEventListener('fullscreenchange', fullscreenchange);
					document.removeEventListener('mozfullscreenchange', fullscreenchange);

					element.requestPointerLock();
				}

			};

			document.addEventListener('fullscreenchange', fullscreenchange, false);
			document.addEventListener('mozfullscreenchange', fullscreenchange, false);

			element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

			element.requestFullscreen();

		} else {

			element.requestPointerLock();

		}

	}, false);

} else {

	instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

}

init();
animate();

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;

var prevTime = performance.now();
var velocity = new THREE.Vector3();

function init() {

	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

	scene = new THREE.Scene();
	scene.fog = new THREE.Fog(0xffffff, 0, 750);

	var light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
	light.position.set(0.5, 1, 0.75);
	scene.add(light);

	controls = new THREE.PointerLockControls(camera);
	scene.add(controls.getObject());

	var onKeyDown = function(event) {

		switch (event.keyCode) {

			case 38: // up
			case 87: // w
				moveForward = true;
				break;

			case 37: // left
			case 65: // a
				moveLeft = true;
				break;

			case 40: // down
			case 83: // s
				moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				moveRight = true;
				break;

			case 32: // space
				if (canJump === true) {
					velocity.y += 350;
				}
				//canJump = false;
				break;

		}

	};

	var onKeyUp = function(event) {

		switch (event.keyCode) {

			case 38: // up
			case 87: // w
				moveForward = false;
				break;

			case 37: // left
			case 65: // a
				moveLeft = false;
				break;

			case 40: // down
			case 83: // s
				moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				moveRight = false;
				break;

		}

	};

	document.addEventListener('keydown', onKeyDown, false);
	document.addEventListener('keyup', onKeyUp, false);

	raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);

	// floor

	geometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
	geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

	var i, l;
	for (i = 0, l = geometry.vertices.length; i < l; i++) {

		var vertex = geometry.vertices[i];
		vertex.x += Math.random() * 20 - 10;
		vertex.y += Math.random() * 2;
		vertex.z += Math.random() * 20 - 10;

	}

	var face;

	for (i = 0, l = geometry.faces.length; i < l; i++) {

		face = geometry.faces[i];
		face.vertexColors[0] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
		face.vertexColors[1] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
		face.vertexColors[2] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);

	}

	material = new THREE.MeshBasicMaterial({
		vertexColors: THREE.VertexColors
	});

	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	// objects

	geometry = new THREE.BoxGeometry(20, 20, 20);

	for (i = 0, l = geometry.faces.length; i < l; i++) {

		face = geometry.faces[i];
		face.vertexColors[0] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
		face.vertexColors[1] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
		face.vertexColors[2] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);

	}

	for (i = 0; i < bookmarks.length; i++) {

		/*
		// Default material.
		material = new THREE.MeshPhongMaterial({
			specular: 0xffffff,
			shading: THREE.FlatShading,
			vertexColors: THREE.VertexColors
		});
		*/
    material = new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('/tiles/' + bookmarks[i].url + '.png')
    });

		mesh = new THREE.Mesh(geometry, material);
		mesh.position.x = Math.floor(Math.random() * 20 - 10) * 20;
		mesh.position.y = Math.floor(Math.random() * 20) * 20 + 10;
		mesh.position.z = Math.floor(Math.random() * 20 - 10) * 20;
		scene.add(mesh);

		material.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);

		objects.push(mesh);

	}

	//

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0xffffff);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	//

	window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

	requestAnimationFrame(animate);

	if (controlsEnabled) {
		raycaster.ray.origin.copy(controls.getObject().position);
		raycaster.ray.origin.y -= 10;

		var intersections = raycaster.intersectObjects(objects);

		var isOnObject = intersections.length > 0;

		var time = performance.now();
		var delta = (time - prevTime) / 1000;

		velocity.x -= velocity.x * 10.0 * delta;
		velocity.z -= velocity.z * 10.0 * delta;

		velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

		if (moveForward) {
			velocity.z -= 400.0 * delta;
		}
		if (moveBackward) {
			velocity.z += 400.0 * delta;
		}

		if (moveLeft) {
			velocity.x -= 400.0 * delta;
		}
		if (moveRight) {
			velocity.x += 400.0 * delta;
		}

		if (isOnObject === true) {
			velocity.y = Math.max(0, velocity.y);

			canJump = true;
		}

		controls.getObject().translateX(velocity.x * delta);
		controls.getObject().translateY(velocity.y * delta);
		controls.getObject().translateZ(velocity.z * delta);

		if (controls.getObject().position.y < 10) {
			velocity.y = 0;
			controls.getObject().position.y = 10;

			canJump = true;

		}

		prevTime = time;

	}

	renderer.render(scene, camera);

}
