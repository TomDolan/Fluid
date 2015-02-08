//////////////////////////////////////////////////////////////////
//Global variables and layout//
//////////////////////////////////////////////////////////////////

var c = document.getElementById("fluid");
var hex = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
var N = 1700, size = 10*N;
var squareSize = 600;
var m = 400;
var dm = squareSize/m;
var dt = 0.15; 
var h = 15; //radius of smoothing kernel
var k = 8; //pressure const
var p0 = 2.3; //rest pressure
pi = Math.PI;

printgrid = new Array(m);
for (i = 0; i < m; i++) {
	printgrid[i] = new Array(m);
	for (j = 0; j < m; j++){
		printgrid[i][j] = 0;
	}
}

// 0-x
// 1-y
// 2-u
// 3-v
// 4-m
// 5-d
// 6-p
// 7-Fx
// 8-Fy
// 9-type

var points = new Array(size);
var print = c.getContext("2d");

//////////////////////////////////////////////////////////////////
//initialisation//
//////////////////////////////////////////////////////////////////

setPosition();
setVelocity();
setOthers();
setBdry();
updatePrint();
//startAnimation();
//for (id = 0; id < 180; id++){
	step();
//}
//Print();

//////////////////////////////////////////////////////////////////
//functions//
//////////////////////////////////////////////////////////////////

//initial functions//
function setPosition(){
	for(i = 0; i < N; i++){
		sN = Math.sqrt(N);
		//points[idx(i,0)]=(i-303)*4/*Math.random()*squareSize*/, points[idx(i,1)]=450;// /*(Math.floor((i)/sN))/sN;*/Math.random()*squareSize;
		//points[idx(i,0)]=Math.random()*squareSize/3+24, points[idx(i,1)]=Math.random()*squareSize*.85+24;
		points[idx(i,0)]=11*(i%16)+100, points[idx(i,1)]= Math.floor((i-891)/16)*11;
	}
}
function setVelocity(){
	for(i = 0; i < N; i++){
		points[idx(i,2)]=0/*Math.random()*.01-.005*/, points[idx(i,3)]=0;//Math.random()*.01-.005;
	}
}
function setOthers(){
	for(i = 0; i < N; i++){
		points[idx(i,4)]=1;
		points[idx(i,5)]=0;
		points[idx(i,6)]=0;
		points[idx(i,7)]=0;
		points[idx(i,8)]=0;
		points[idx(i,9)]=1;
	}
}
function setBdry(){
	for(i = 0; i < 101; i++){ 
		points[idx(i,0)]=i*squareSize/100;
		points[idx(i,1)]=squareSize;
		points[idx(i,2)]=0;
		points[idx(i,3)]=0;
		points[idx(i,4)]=1;
		points[idx(i,5)]=0;
		points[idx(i,6)]=0;
		points[idx(i,7)]=0;
		points[idx(i,8)]=0;
		points[idx(i,9)]=0;
	}
	for(i = 101; i < 202; i++){
		points[idx(i,0)]=(i-101)*squareSize/100;
		points[idx(i,1)]=squareSize-6;
		points[idx(i,2)]=0;
		points[idx(i,3)]=0;
		points[idx(i,4)]=1;
		points[idx(i,5)]=0;
		points[idx(i,6)]=0;
		points[idx(i,7)]=0;
		points[idx(i,8)]=0;
		points[idx(i,9)]=0;
	}
	for(i = 202; i < 303; i++){
		points[idx(i,0)]=(i-202)*squareSize/100;
		points[idx(i,1)]=squareSize-12;
		points[idx(i,2)]=0;
		points[idx(i,3)]=0;
		points[idx(i,4)]=1;
		points[idx(i,5)]=0;
		points[idx(i,6)]=0;
		points[idx(i,7)]=0;
		points[idx(i,8)]=0;
		points[idx(i,9)]=0;
	}
		
	for(i = 303; i < 401; i++){
		points[idx(i,0)]=0;
		points[idx(i,1)]=(i-303)*squareSize/100;
		points[idx(i,2)]=0;
		points[idx(i,3)]=0;
		points[idx(i,4)]=1;
		points[idx(i,5)]=0;
		points[idx(i,6)]=0;
		points[idx(i,7)]=0;
		points[idx(i,8)]=0;
		points[idx(i,9)]=0;
	}
	for(i = 401; i < 499; i++){
		points[idx(i,0)]=6;
		points[idx(i,1)]=(i-401)*squareSize/100;
		points[idx(i,2)]=0;
		points[idx(i,3)]=0;
		points[idx(i,4)]=1;
		points[idx(i,5)]=0;
		points[idx(i,6)]=0;
		points[idx(i,7)]=0;
		points[idx(i,8)]=0;
		points[idx(i,9)]=0;
	}
	for(i = 499; i < 597; i++){
		points[idx(i,0)]=12;
		points[idx(i,1)]=(i-499)*squareSize/100;
		points[idx(i,2)]=0;
		points[idx(i,3)]=0;
		points[idx(i,4)]=1;
		points[idx(i,5)]=0;
		points[idx(i,6)]=0;
		points[idx(i,7)]=0;
		points[idx(i,8)]=0;
		points[idx(i,9)]=0;
	}
		
	for(i = 597; i < 695; i++){
		points[idx(i,0)]=squareSize;
		points[idx(i,1)]=(i-597)*squareSize/100;
		points[idx(i,2)]=0;
		points[idx(i,3)]=0;
		points[idx(i,4)]=1;
		points[idx(i,5)]=0;
		points[idx(i,6)]=0;
		points[idx(i,7)]=0;
		points[idx(i,8)]=0;
		points[idx(i,9)]=0;
	}
	for(i = 695; i < 793; i++){
		points[idx(i,0)]=squareSize-6;
		points[idx(i,1)]=(i-695)*squareSize/100;
		points[idx(i,2)]=0;
		points[idx(i,3)]=0;
		points[idx(i,4)]=1;
		points[idx(i,5)]=0;
		points[idx(i,6)]=0;
		points[idx(i,7)]=0;
		points[idx(i,8)]=0;
		points[idx(i,9)]=0;
	}
	for(i = 793; i < 891; i++){
		points[idx(i,0)]=squareSize-12;
		points[idx(i,1)]=(i-793)*squareSize/100;
		points[idx(i,2)]=0;
		points[idx(i,3)]=0;
		points[idx(i,4)]=1;
		points[idx(i,5)]=0;
		points[idx(i,6)]=0;
		points[idx(i,7)]=0;
		points[idx(i,8)]=0;
		points[idx(i,9)]=0;
	}
}
function startAnimation(){
	requestAnimationFrame(step);
}

//processes//
function step(){
	calcDens();
	calcPres();
	move();
	updatePrint();
	requestAnimationFrame(step);
}

function calcDens(){
	for(i = 0; i < N; i++){
		points[idx(i,5)]=0;
		for(j = 0; j < N; j++){
			points[idx(i,5)]+=points[idx(j,4)]*W(i,j);
		}
		points[idx(i,6)]=k*(points[idx(i,5)]-p0);
	}
	//alert(points[idx(150,5)]);
	//alert(points[idx(50,6)]);
	//alert(points[idx(1,5)]);
	//alert(points[idx(1,6)]);
}

function calcPres(){
	for(i = 0; i < N; i++){
		points[idx(i,7)]=0;
		points[idx(i,8)]=0;
		for(j = 0; j < N; j++){
			if (i!=j){
				var w = W(i,j);
				if(w == 1){
					points[idx(i,7)]-=Math.random()-.5;
					points[idx(i,8)]-=Math.random()-.5;
				} else if (w != 0){
					points[idx(i,7)]-=points[idx(j,4)]*(points[idx(j,6)]+points[idx(i,6)])/(2*points[idx(j,5)])*(points[idx(j,0)]-points[idx(i,0)])/(1-w);
					points[idx(i,8)]-=points[idx(j,4)]*(points[idx(j,6)]+points[idx(i,6)])/(2*points[idx(j,5)])*(points[idx(j,1)]-points[idx(i,1)])/(1-w);
				}
			}
		}
	}
	//alert("press " + points[idx(0,6)] + " " + points[idx(1,6)])
	//alert(points[idx(100,7)] + " " + points[idx(100,8)]);
	//alert(points[idx(1,7)] + " " + points[idx(1,8)]);
}

function calcVisc(){
	for(i = 0; i < N; i++){
		for(j = 0; j < N; j++){
			points[idx(i,7)]-=.01*(points[idx(i,0)]-points[idx(j,0)])*(points[idx(i,0)]-points[idx(j,0)])*(points[idx(i,2)]-points[idx(j,2)])*points[idx(j,4)]/points[idx(j,5)]*W(i,j);
			points[idx(i,8)]-=.01*(points[idx(i,1)]-points[idx(j,1)])*(points[idx(i,1)]-points[idx(j,1)])*(points[idx(i,3)]-points[idx(j,3)])*points[idx(j,4)]/points[idx(j,5)]*W(i,j);
		}
	}
}

function move(){
	for(i = 0; i < N; i++){
		points[idx(i,7)]+=0;
		points[idx(i,8)]+=.98*points[idx(i,5)];
		points[idx(i,2)]=points[idx(i,2)]+points[idx(i,7)]/points[idx(i,4)]*dt;
		points[idx(i,3)]=points[idx(i,3)]+points[idx(i,8)]/points[idx(i,4)]*dt;
		points[idx(i,0)]=Math.max(0,Math.min(squareSize,points[idx(i,0)]+points[idx(i,9)]*(points[idx(i,2)]*dt+.5*points[idx(i,7)]/points[idx(i,4)]*dt*dt)));
		points[idx(i,1)]=Math.max(0,Math.min(squareSize,points[idx(i,1)]+points[idx(i,9)]*(points[idx(i,3)]*dt+.5*points[idx(i,8)]/points[idx(i,4)]*dt*dt)));
	}
}

//print functions//
function updatePrint(){
	print.clearRect(0, 0, c.width, c.height);
	for (i = 0; i<N; i++){
		//var colour = "#fff";
		//print.fillStyle = colour;	
		//print.fillRect(.99*points[idx(i,0)], .99*points[idx(i,1)], 2, 2);	
		print.beginPath();
		print.arc(.99*points[idx(i,0)], .99*points[idx(i,1)], points[idx(i,5)]*1.5, 0, 2 * pi);
		print.fill();
	}
	/*calcPrint();
	for (i = 0; i < m; i++){
		for (j = 0; j < m; j++){
			//g = Math.min(15,Math.floor(printgrid[i][j]*10));
			//var f = hex[g];
			var f = hex[printgrid[i][j]];
			var colour = "#" + f + "2" + "4";
			print.fillStyle = colour;	
			print.fillRect(i*dm, j*dm, dm, dm);	
		}
	}*/
}

function Print(){
	for (i = 0; i < m; i++) {
		for (j = 0; j < m; j++){
			printgrid[i][j] = 0;
			for (l = 0; l < N; l++){
				dx = i*dm-points[idx(l,0)];
				dy = j*dm-points[idx(l,1)];
				d = Math.max(0,1 - Math.sqrt(dx*dx+dy*dy)/h);
				printgrid[i][j] += d;
			}
			if (printgrid[i][j] < 1){
				printgrid[i][j] = 0;
			} else if (printgrid[i][j] < 1.2) {
				printgrid[i][j] = 15;
			} else {
				printgrid[i][j] = 12;
			}
		}
	}
	for (i = 0; i < m; i++){
		for (j = 0; j < m; j++){
			//g = Math.min(15,Math.floor(printgrid[i][j]*10));
			//var f = hex[g];
			var f = hex[printgrid[i][j]];
			var colour = "#" + f + "2" + "4";
			print.fillStyle = colour;	
			print.fillRect(i*dm, j*dm, dm, dm);	
		}
	}
}

//housekeeping functions//
function idx(i, j){
	return 10*i+j;
}
function W(r,rj){
	dx = points[idx(r,0)]-points[idx(rj,0)];
	dy = points[idx(r,1)]-points[idx(rj,1)];
	return Math.max(0,1 - Math.sqrt(dx*dx+dy*dy)/h);//0.15915494309*Math.exp(-(dx*dx+dy*dy)/h/h)/h/h;
}
