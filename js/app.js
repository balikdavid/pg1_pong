import materials from "./materials.js";



//light
var spotLight1, spotLight2;
var pointLight;

//scene variables
var renderer, camera , scene = new THREE.Scene();
//field
var fieldWidth = 300, fieldHeight = 200;
var ballDirX = 1, ballDirY = 1, ballSpeed = 2;

//game vars
var ball, instrument1, instrument2;
var radius;
var randDirection;
var myScore = 0, opponentsScore = 0;


window.onload = function setup() {
	setThree();
	//console.log("here")

	animateThree();
}


function setThree() {

	//var WIDTH = 1300;
	//var HEIGHT = 480;
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight ,0.1,1000);
	scene.add(camera);
	//camera.zoom = 10000;
	//camera.position.y = 250;
	camera.position.z = 300; //pro pohled "zepredu"

	//camera.lookAt(new THREE.Vector3(0,-20,0));

	

	//initSpotLight(); //light is neccessary because of using MeshLambertMaterial --> light first!, MeshBasicMaterial --> no light needed
	initTable();
	initBall();
	initInstrument1();
	initInstrument2();
	initInstrument2();
	initSurface();
	//cameraPositioning();
	initBarrier1();
	initBarrier2();
	//initSpotLight2();
	initPointLight();
	//ballPointLight();

	

	renderer.shadowMapEnabled = true;

}

function animateThree() {
	requestAnimationFrame(animateThree);
	renderer.render(scene, camera);

	//moving
	//moveBall();
	ballPointLight();
	
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
	spotLight1 = new THREE.SpotLight(0xfffff, 7); //zmizi ostatni barvy a je tam vse cerveneff0000,
  	spotLight1.position.set(0,0, 200 ); //zatim svitim na "predni stranu po ose z z vysky = 0,0,300
  	spotLight1.castShadow = true;
  	scene.add(spotLight1);

	/*
	spotLight2 = new THREE.SpotLight(0xFFFFF, 10);
	spotLight2.position.set(60,6000, 200); //
	spotLight2.castShadow = true;
	scene.add(spotLight2);
	*/

}

function initSpotLight2(){
	spotLight2 = new THREE.SpotLight(0xfffff, 3); //zmizi ostatni barvy a je tam vse cerveneff0000,
  	spotLight2.position.set(-600,0, 0 ); //zatim svitim na "predni stranu po ose z z vysky = 0,0,300
  	spotLight2.castShadow = true;
  	scene.add(spotLight2);
}

function initBall(){
	 radius = 5;
	 var segments = 6, rings = 6;
	//SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
	const geometry = new THREE.SphereGeometry(radius,10,rings);
	ball = new THREE.Mesh( geometry, materials.ball);
	ball.position.x = 0;
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

function initBarrier1(){
	var barrier1 = new THREE.Mesh(
		new THREE.BoxGeometry(fieldWidth , 10 ,30,),materials.barrier
		);
	barrier1.position.x = 0;
	barrier1.position.y = -(fieldHeight/2 + 10);;
	barrier1.position.z =  -5;
	barrier1.castShadow = true;
	barrier1.receiveShadow = true;
	scene.add(barrier1);
}


function initBarrier2(){
	var barrier2 = new THREE.Mesh(
		new THREE.BoxGeometry(fieldWidth , 10 ,30,),materials.barrier
		);
	barrier2.position.x = 0;
	barrier2.position.y = fieldHeight/2 + 10;
	barrier2.position.z =  -5;
	barrier2.castShadow = true;
	barrier2.receiveShadow = true;
	scene.add(barrier2);
	}

function cameraPositioning(){

	

	camera.position.x = instrument1.position.x-200;	//-70 --> taky ok											
	camera.position.y += (instrument1.position.y - camera.position.y) * 0.05; 
	camera.position.z = 100; //+100

	camera.rotation.x = -0.02 * (ball.position.y) * Math.PI/180;
	camera.rotation.y = -60 * Math.PI/180;		// -60																
	camera.rotation.z = -90 * Math.PI/180;
}


function initPointLight(){
	//PointLight( color : Integer, intensity : Float, distance : Number, decay : Float )
	pointLight = new THREE.PointLight(0xfffff); 
	pointLight.position.x = -30;
	pointLight.position.y = -50;
	pointLight.position.z = 22;
	pointLight.intensity = 7.5;
	scene.add(pointLight);
}

function ballPointLight(){
	pointLight.position.x = ball.position.x + (radius*2);
	pointLight.position.y = ball.position.y - (radius*2);
}


function moveBall(){

	//start move -> balonek jede na zacatku hry na toho kdo ma lepsi vyhled --> -1
	if(myScore == 0 && opponentsScore == 0){
		ball.position.x +=  -1 * ballSpeed; // * ballSpeed;
		ball.position.y +=  0 ;//ballDirY * ballSpeed;
	}else{
		ball.position.x +=  ballDirX * ballSpeed;
		ball.position.y +=  ballDirY * ballSpeed;
	}

	//ball hitting barriers
	//top barrier (left from future camera view)
	if(ball.position.y >= fieldHeight/2 - ball.geometry.parameters.radius){
		ball.position.y = fieldHeight/2 - ball.geometry.parameters.radius;
		//sound for left barrier
		ballDirY = -ballDirY;

	}


	if(ball.position.y <= -(fieldHeight/2 - ball.geometry.parameters.radius)){
		ball.position.y = -(fieldHeight/2 - ball.geometry.parameters.radius);
		//sound for right barrier
		ballDirY = -ballDirY;
	}

	//ball hits my opponents score lines
	if(ball.position.x == fieldWidth/2 + (ball.geometry.parameters.radius*2)){ // hranice stolu + prumer balonku = gol --> balonek musi projit cely za caru
		myScore++;
		//console.log("myScore: " + myScore);
		//console.log(fieldWidth/2 + (ball.geometry.parameters.radius*2))
		//goalScoreSound --> PLAY
		//reset ball
		resetBall("myScore");
		document.getElementById("score").innerHTML = myScore + " : " + opponentsScore;
		
	}

	//ball hits my score lines
	if(ball.position.x == -(fieldWidth/2 + (ball.geometry.parameters.radius*2))){
		opponentsScore++;
		//console.log("opponentsScore: " + opponentsScore);
		//console.log(-(fieldWidth/2 + (ball.geometry.parameters.radius*2)))
		//goalScoreSound --> PLAY
		//reset ball
		resetBall("opponentsScore");
		document.getElementById("score").innerHTML = myScore + " : " + opponentsScore;

	}

}

function resetPosition(){
	ball.position.x = 0;
	ball.position.y = 0;
}

//balonek po resetu leti na toho kdo dal gol
function resetBall(str){
	if(str == "myScore"){
		resetPosition();
		ballDirX = -1;
	}else{
		resetPosition();
		ballDirX = 1;
	}
	ballDirY = 0;

}
	






/**
 * 
 * 
 * 
 * 
 * 
 * ball hitting paddles
 * if(ball.position.x < instrument1.position.x + instrument1.geometry.parameters.width/2 && ball.position.x > instrument1.position.x - instrument1.geometry.parameters.width/2){
		if(ball.position.y < instrument1.position.y + instrument1.geometry.parameters.height/2 && ball.position.y > instrument1.position.y - instrument1.geometry.parameters.height/2){
			ball.position.x = instrument1.position.x + instrument1.geometry.parameters.width/2;
			ballSpeed = -ballSpeed;
		}
 * 
 * 
 * 
 */