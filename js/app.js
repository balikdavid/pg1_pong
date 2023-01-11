import materials from "./materials.js";



//light
var spotLight1, spotLight2;

//scene variables
var renderer, camera , scene = new THREE.Scene();
//field
var fieldWidth = 300, fieldHeight = 200;
//game vars
var ball, instrument1, instrument2;


window.onload = function setup() {
	setThree();
	//console.log("here")

	animate();
}


function setThree() {

	//var WIDTH = 1300;
	//var HEIGHT = 480;
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight ,0.1,10000);
	scene.add(camera);
	//camera.position.y = 250;
	//camera.position.z = 300; pro pohled "zepredu"

	//camera.lookAt(new THREE.Vector3(0,-20,0));

	

	initSpotLight(); //light is neccessary because of using MeshLambertMaterial --> light first!, MeshBasicMaterial --> no light needed
	initTable();
	initBall();
	initInstrument1();
	initInstrument2();
	initInstrument2();
	initSurface();
	cameraPositioning();

	renderer.shadowMapEnabled = true;

}

function initTable() {
	// BoxGeometry(width,height,depth, widthSegments, heightSegments, depthSegments) --> 1 is default
	const geometry = new THREE.BoxGeometry(fieldWidth * 1.0,fieldHeight * 1.03, 101, 10, 10);
	//const material = new THREE.MeshBasicMaterial({color : 0xFFFFF});
	//console.log(materials.table)
	const table = new THREE.Mesh( geometry, materials.table);
	scene.add( table );
	table.position.z = -51;
	table.castShadow = true;
	table.receiveShadow = true;
}

function initSpotLight(){
//PointLight( color : Integer, intensity : Float, distance : Number, decay : Float )
	spotLight1 = new THREE.SpotLight(0xfffff, 10); //zmizi ostatni barvy a je tam vse cerveneff0000,
  	spotLight1.position.set(300,0, 300 ); //zatim svitim na "predni stranu po ose z z vysky = 0,0,300
  	spotLight1.castShadow = true;
  	scene.add(spotLight1);

	/*
	spotLight2 = new THREE.SpotLight(0xFFFFF, 10);
	spotLight2.position.set(60,6000, 200); //
	spotLight2.castShadow = true;
	scene.add(spotLight2);
	*/

}

function initBall(){
	var radius = 5, segments = 6, rings = 6;
	//SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
	const geometry = new THREE.SphereGeometry(radius,segments,rings);
	ball = new THREE.Mesh( geometry, materials.ball);
	ball.position.x = 60;
	ball.position.y = 0;
	ball.position.z = /*(101/2) + */radius ; ; //ball on surface of the table sphere.position.y = cube.position.y + (cube.geometry.parameters.height / 2) + (sphere.geometry.parameters.radius);
	ball.castShadow = true;
	ball.receiveShadow = true;
	scene.add( ball );
}


// instrument je to cim hrac odrazi balonek
function initInstrument1(){
	var inWidth = 5;
  	var inHeight = 35;
  	var inDepth = 8;
  	
	 instrument1 = new THREE.Mesh(
		new THREE.BoxGeometry(inWidth,inHeight,inDepth),materials.instrument1);
	scene.add(instrument1);
	instrument1.position.x = (-fieldWidth/2) + inWidth;
	instrument1.position.z = inDepth-5; //without plane geomtrey 101/2 + inDepth/2;
}

function initInstrument2(){
	var inWidth = 5;
  	var inHeight = 35;
  	var inDepth = 8;
  	
	instrument2 = new THREE.Mesh(
		new THREE.BoxGeometry(inWidth,inHeight,inDepth),materials.instrument2
		);
	scene.add(instrument2);
	instrument2.position.x = fieldWidth/2 - inWidth ;
	instrument2.position.z = inDepth-5; //101/2 + inDepth/2;
}


function initSurface(){
	var surface = new THREE.Mesh(
		new THREE.PlaneGeometry(fieldWidth * 0.98,fieldHeight,10,10),materials.plane
		);
	  scene.add(surface);
	  surface.receiveShadow = true;
	  surface.castShadow = true;
}

function cameraPositioning(){

	camera.position.x = instrument1.position.x-100;	//-70 --> taky ok											
	camera.position.y += (instrument1.position.y - camera.position.y) * 0.05; 
	camera.position.z = 100; //+100

	camera.rotation.x = -0.02 * (ball.position.y) * Math.PI/180;
	camera.rotation.y = -60 * Math.PI/180;		// -60																
	camera.rotation.z = -90 * Math.PI/180;
}
















function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}