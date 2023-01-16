import materials from "./materials.js";
import sounds from "./sounds.js";



//light
var pointLight;

//scene variables
var renderer, camera , scene = new THREE.Scene();
//field
var fieldWidth = 300, fieldHeight = 200;


//game vars
var ball, instrument1, instrument2;
var ballDirX = -1, ballDirY = 0, ballSpeed = 2; //ball speed and direction
var radius;
var myScore = 0, opponentsScore = 0;
var inWidth = 5;
var inHeight = 45;
var inDepth = 8;
var in1DirY = 0, in2DirY = 0, inSpeed = 1.8; //instrument direction and speed
var gameMode = false;

document.addEventListener("keyup", event => {
	Keys.onKeyup(event);
	
  });
  
  document.addEventListener("keydown", event => {
	Keys.onKeydown(event);
  });

  document.addEventListener("keydown", event => {
	if (event.code === "KeyI") {
		gameMode = !gameMode;
	}
  });


var Keys = {_pressed: {},
  A: 65,
  D: 68,
  J: 74,
  L: 76,
  I: 73,

  isDown: function(keyCode) {
    return this._pressed[keyCode];
	
  },

  onKeydown: function(event) {
    this._pressed[event.keyCode] = true;
  },

  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  }
};

window.onload = function setup() {
	setThree();
	animateThree();
}


function setThree() {
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight ,0.1,1000);
	scene.add(camera);
	//camera.zoom = 10000;
	//camera.position.y = 250;
	camera.position.z = 300; //pro pohled "zepredu"
	console.log(gameMode);

	//camera.lookAt(new THREE.Vector3(0,-20,0));

	
	initDirectionLight();//light is neccessary because of using MeshLambertMaterial --> light first!, MeshBasicMaterial --> no light needed
	initTable();
	initBall();
	initInstrument1();
	initInstrument2();
	initSurface();
	cameraPositioning();
	initBarrier1();
	initBarrier2();
	initPointLight();

	renderer.shadowMapEnabled = true;

}

function animateThree() {
	requestAnimationFrame(animateThree);
	renderer.render(scene, camera);
	//cameraPositioning();

	//moving
	moveBall();
	instrumentPhysics();
	ballPointLight();
	player1Move(); //me


	//todle predelat do metody, stejne tak pohledy kamery
	// na zvuky se asi vysrat a misto toho zmenit kameru
	
	//game modes
	//player2Move(); //computer
	gameModeChange(gameMode);
	
}


//lights
function initPointLight(){
	//PointLight( color : Integer, intensity : Float, distance : Number, decay : Float )
	pointLight = new THREE.PointLight(0xfdcddb); 
	pointLight.position.x = -30;
	pointLight.position.y = -50;
	pointLight.position.z = 22;
	pointLight.intensity = 1.4;
	scene.add(pointLight);
}

function initDirectionLight(){
	var directionalLight = new THREE.DirectionalLight( 0xa0fee2 , 4);
	directionalLight.position.set( 100 , -fieldHeight/2-600, 100 );
	directionalLight.castShadow = true;
	scene.add( directionalLight );
}


//enviroment

function initTable() {
	// BoxGeometry(width,height,depth, widthSegments, heightSegments, depthSegments) --> 1 is default
	const geometry = new THREE.BoxGeometry(fieldWidth * 1.0,fieldHeight * 1.1, 100, 10, 10);
	const table = new THREE.Mesh( geometry, materials.table);
	scene.add( table );
	table.position.z = -51;
	table.castShadow = true;
	table.receiveShadow = true;
}

function initSurface(){
	var surface = new THREE.Mesh(
		new THREE.PlaneGeometry(fieldWidth * 0.98,fieldHeight,10,10),materials.plane
		);
	  scene.add(surface);
	  surface.receiveShadow = true;
	  surface.castShadow = true;
}



function initBall(){
	radius = 5;
	var rings = 5;
	//SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
	const geometry = new THREE.SphereGeometry(radius,10,rings);
	ball = new THREE.Mesh( geometry, materials.ball);
	ball.position.x = 0;
	ball.position.y = 0;
	ball.position.z = /*(101/2) + */radius; //ball on surface of the table
	ball.receiveShadow = true;
	scene.add( ball );
}


// instrument je to cim hrac odrazi balonek
function initInstrument1(){
  	
	 instrument1 = new THREE.Mesh(
		new THREE.BoxGeometry(inWidth,inHeight,inDepth),materials.instrument1);
	scene.add(instrument1);
	instrument1.receiveShadow = true;
	instrument1.castShadow = true;
	instrument1.position.x = (-fieldWidth/2) + inWidth;
	instrument1.position.z = inDepth-5; //without plane geomtrey 101/2 + inDepth/2;
}

function initInstrument2(){

	instrument2 = new THREE.Mesh(
		new THREE.BoxGeometry(inWidth,inHeight,inDepth),materials.instrument2
		);
	scene.add(instrument2);
	instrument2.position.x = fieldWidth/2 - inWidth ;
	instrument2.position.z = inDepth-5; //101/2 + inDepth/2;
}


function initBarrier1(){
	var barrier1 = new THREE.Mesh(
		new THREE.BoxGeometry(fieldWidth , 10 ,30,),materials.barrier
		);
	barrier1.position.x = 0;
	barrier1.position.y = -(fieldHeight/2 + 10);;
	barrier1.position.z =  -5;
	barrier1.castShadow = true;
	//barrier1.receiveShadow = true;
	scene.add(barrier1);
}


function initBarrier2(){
	var barrier2 = new THREE.Mesh(
		new THREE.BoxGeometry(fieldWidth , 10 ,30,),materials.barrier
		);
	barrier2.position.x = 0;
	barrier2.position.y = fieldHeight/2 + 10;
	barrier2.position.z =  -5;
	scene.add(barrier2);
	}

function cameraPositioning(){

	camera.position.x = instrument1.position.x-200;	//-200 --> taky ok											
	camera.position.y += (instrument1.position.y - camera.position.y) * 0.05; 
	camera.position.z = 100; //+100

	//camera.rotation.x = -0.02 * (ball.position.y) * Math.PI/180;
	camera.rotation.y = -60 * Math.PI/180;		// -60																
	camera.rotation.z = -90 * Math.PI/180;
}




function ballPointLight(){
	pointLight.position.x = ball.position.x + (radius*2);
	pointLight.position.y = ball.position.y - (radius*2);
}


function moveBall(){

	ball.position.x +=  ballDirX * ballSpeed;
	ball.position.y +=  ballDirY * ballSpeed ;

	//ball hitting barriers
	//top barrier (left from future camera view)
	if(ball.position.y >= fieldHeight/2 - ball.geometry.parameters.radius){
		ball.position.y = fieldHeight/2 - ball.geometry.parameters.radius;
		sounds.wall.play();
		ballDirY = -ballDirY;

	}


	if(ball.position.y <= -(fieldHeight/2 - ball.geometry.parameters.radius)){
		ball.position.y = -(fieldHeight/2 - ball.geometry.parameters.radius);
		sounds.wall.play();
		ballDirY = -ballDirY;
	}

	//ball hits opponents score lines
	if(ball.position.x == fieldWidth/2 + (ball.geometry.parameters.radius*2)){ // hranice stolu + prumer balonku = gol --> balonek musi projit cely za caru
		myScore++;
		sounds.goal.play();
		//reset ball
		resetBall("myScore");
		document.getElementById("score1").innerHTML = myScore;
		
	}

	//ball hits my score lines
	if(ball.position.x == -(fieldWidth/2 + (ball.geometry.parameters.radius*2))){
		opponentsScore++;
		//console.log(-(fieldWidth/2 + (ball.geometry.parameters.radius*2)))
		sounds.goal.play();
		resetBall("opponentScore");
		document.getElementById("score2").innerHTML = opponentsScore;
	}

	
	//speed check for slowing down the ball
	checkSpeed();

}

function checkSpeed(){
	//console.log(" in check speed");
	if (ballDirY > ballSpeed * 2){
		inSpeed *= 1.2;
		ballDirY = ballSpeed * 1.5;
		
	}else if (ballDirY < -ballSpeed * 2){
		inSpeed *= 1.2;
		ballDirY = -ballSpeed * 1.5;
	}

}



function instrumentPhysics() {
	if (ball.position.x <= instrument1.position.x + inWidth &&  ball.position.x >= instrument1.position.x){
			if (ball.position.y <= instrument1.position.y + inHeight/2 &&  ball.position.y >= instrument1.position.y - inHeight/2){
				if (ballDirX < 0){
					ballDirX = -ballDirX;
					ballDirY -= in1DirY * 0.8;
					sounds.instrument.play();
				}
			}
		}
		if (ball.position.x <= instrument2.position.x+inWidth &&  ball.position.x >= instrument2.position.x){
			if (ball.position.y <= instrument2.position.y + inHeight/2 &&  ball.position.y >= instrument2.position.y - inHeight/2){
				if (ballDirX > 0){
					ballDirX = -ballDirX;
					ballDirY -= in2DirY * 0.8;
					sounds.instrument.play();
					
				}
			}
		}
}



function player1Move(){
	if (Keys.isDown(Keys.A)){
		if (instrument1.position.y < fieldHeight / 2 - inHeight/2){
			in1DirY = inSpeed;
		}
		else{
			in1DirY = 0;
		}

	}else if (Keys.isDown(Keys.D)){
		if (instrument1.position.y > -fieldHeight/2 + inHeight/2 ){
				in1DirY = -inSpeed;
			}
		else{
				in1DirY = 0;
			}
		}else{
			in1DirY = 0;
		}

	instrument1.position.y += in1DirY;

}


function gameModeChange(gameMode){
	if(gameMode === true){
		AI();
	}else{
		player2Move();
	}
}

function player2Move(){

	if (Keys.isDown(Keys.J)){
		if (instrument2.position.y < fieldHeight / 2 - inHeight/2){
			in2DirY = inSpeed;
		}
		else{
			in2DirY = 0;
		}
	}else if (Keys.isDown(Keys.L)){
		if (instrument2.position.y > -fieldHeight/2 + inHeight/2 ){
			in2DirY = -inSpeed;
			}
		else{
			in2DirY = 0;
			}
		}else{
			in2DirY = 0;
		}
		instrument2.position.y += in2DirY;

}

function AI() {
	in2DirY = 1;
    //move the instrument towards the ball along the y-axis
    if(ball.position.y < instrument2.position.y) {
        in2DirY = -inSpeed * 1.8;
    } else if(ball.position.y > instrument2.position.y) {
        in2DirY = inSpeed * 1.8;
    } else {
        in2DirY = 0;
    }
    instrument2.position.y += in2DirY;
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
	


