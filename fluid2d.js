//////////////////////////////////////////////////////////////////
//Global variables and layout//
//////////////////////////////////////////////////////////////////

var c = document.getElementById("fluid");
var hex = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
var N = 200, squareSize = 600, h = squareSize/N, size = (N+2)*(N+2);
var dt = .3; 

var u = new Array(size), v = new Array(size);
var uOld = new Array(size), vOld = new Array(size);
var dens = new Array(size), densOld = new Array(size);
var print = c.getContext("2d");
var G = new Array(size);

var xOld=-1, yOld=-1, x=-1, y=-1, uxy=0, vxy=0;

//////////////////////////////////////////////////////////////////
//initialisation//
//////////////////////////////////////////////////////////////////

setVelocity();
setDensity();
setVelocityBoundary();
setBoundary();
setG();
startAnimation();

//////////////////////////////////////////////////////////////////
//functions//
//////////////////////////////////////////////////////////////////

//initial functions//
function setVelocity(){
	for(i = 0; i < N+2; i++){
		for (j = 0; j < N+2; j++){
			u[idx(i,j)]=Math.random()-.5, v[idx(i,j)]=Math.random()-.5;
			uOld[idx(i,j)]=u[idx(i,j)], vOld[idx(i,j)]=v[idx(i,j)];
		}
	}
}
function setDensity(){
	for(i = 1; i <= N; i++){
		for (j = 1; j <= N; j++){
			dens[idx(i,j)] = 0, densOld[idx(i,j)] = 0;
			print.fillStyle = "#024";
			print.fillRect((i-1)*h, (j-1)*h, h+1, h+1);
			if (j < N/2){
				dens[idx(i,j)] = 1, densOld[idx(i,j)] = 1;
				print.fillStyle = "#f24";
				print.fillRect((i-1)*h, (j-1)*h, h, h);
			}
		}
	}	
}
function startAnimation(){
	//intervalName=setInterval("step()", 0); 
	requestAnimationFrame(step);
}

//processes//
function step(){
	stepVelocity();
	stepDensity();
	//updatePrint();
	requestAnimationFrame(step);
}
function stepVelocity(){
	velocityForces();
	project();
	copy(uOld, u);
	copy(vOld, v);
	velocityAdvect();
	project();
}
function stepDensity(){
	forces();
	copy(densOld, dens);
	advect();
}

//density processes//
function forces(){
	if(x!=-1 && xOld!=-1){
		if(x==xOld&&y==yOld){
			for (i = 1; i <= N; i++){
				for (j = 1; j <= N; j++){
					if((i-x)*(i-x)+(j-y)*(j-y) < 5){
						dens[idx(i,j)] = Math.min(1, dens[idx(i,j)]+.75); 
					}
				}
			} 
		}else if(x==xOld){
			for (i = Math.min(y,yOld); i < Math.max(y,yOld); i++){
				dens[idx(x-2,i)] = Math.min(1, dens[idx(i,j)]+.5);
				dens[idx(x-1,i)] = Math.min(1, dens[idx(i,j)]+.5);
				dens[idx(x,i)] = Math.min(1, dens[idx(i,j)]+.75);
				dens[idx(x+1,i)] = Math.min(1, dens[idx(i,j)]+.5);
				dens[idx(x+2,i)] = Math.min(1, dens[idx(i,j)]+.5);
			}
		} else {
			for (i = 1; i <= N; i++){
				for (j = 1; j <= N; j++){
					var m = (yOld-y)/(xOld-x);
					if(i>=Math.min(x,xOld)&&i<=Math.max(x,xOld)&&j>=Math.min(y,yOld)&&j<=Math.max(y,yOld)&&Math.abs(j-m*i-y+m*x) < 5){
						dens[idx(i,j)] = Math.min(1, dens[idx(i,j)]+.75); 
					}
				}
			}
		}
	}
	xOld = x;
	yOld = y;
}
function advect(){
	var i0,j0,i1,j1,xpos,ypos,s0,t0,s1,t1;
	var dt0 = N*dt;
	for (i = 1; i <= N; i++){
		for (j = 1; j <= N; j++){
			xpos = i-dt0*u[idx(i,j)];
			ypos = j-dt0*v[idx(i,j)];
			if(xpos<.5){
				xpos = .5;
			} else if (xpos>N+.5){
				xpos = N+.5;
			}
			if(ypos<.5){
				ypos = .5;
			} else if (ypos>N+.5){
				ypos = N+.5;
			}
			i0 = Math.floor(xpos), j0 = Math.floor(ypos);
			i1 = i0+1, j1 = j0+1;
			s1 = (xpos - i0), s0 = 1-s1;
			t1 = (ypos - j0), t0 = 1-t1;
			dens[idx(i,j)] = s0*(t0*densOld[idx(i0,j0)]+t1*densOld[idx(i0,j1)])+s1*(t0*densOld[idx(i1,j0)]+t1*densOld[idx(i1,j1)]);
			
			g = Math.floor(dens[idx(i,j)]*15);
			if(G[idx(i,j)] != g) {
				G[idx(i,j)] = g;
				var f = hex[g];
				var colour = "#" + f + 2 + 4;
				//print.clearRect((i-1)*h, (j-1)*h, h, h);
				print.fillStyle = colour;	
				print.fillRect((i-1)*h, (j-1)*h, h+1, h+1);	
			}
		}
	}
	setBoundary();
}

//velocity processes//
function velocityForces(){
	if(x!=-1 && xOld!=-1 && uxy && vxy){
		if(x==xOld&&y==yOld){
		}else if(x==xOld){
			for (i = Math.min(y,yOld); i < Math.max(y,yOld); i++){
				u[idx(x,i)] = .2*uxy;
				v[idx(x,i)] = .2*vxy;
			}
		} else {
			for (i = 1; i <= N; i++){
				for (j = 1; j <= N; j++){
					var m = (yOld-y)/(xOld-x);
					if(i>=Math.min(x,xOld)&&i<=Math.max(x,xOld)&&j>=Math.min(y,yOld)&&j<=Math.max(y,yOld)&&Math.abs(j-m*i-y+m*x) < 1){
						u[idx(i,j)] = .2*uxy; 
						v[idx(i,j)] = .2*vxy;
					}
				}
			}
		}
		uxy = 0;
		vxy = 0;
	}
}
function velocityAdvect(){
	var i0,j0,i1,j1,xpos,ypos,s0,t0,s1,t1;
	var dt0 = N*dt;
	for (i = 1; i <= N; i++){
		for (j = 1; j <= N; j++){
			xpos = i-dt0*uOld[idx(i,j)];
			ypos = j-dt0*vOld[idx(i,j)];
			if(xpos<.5){
				xpos = .5;
			} else if (xpos>N+.5){
				xpos = N+.5;
			}
			if(ypos<.5){
				ypos = .5;
			} else if (ypos>N+.5){
				ypos = N+.5;
			}
			i0 = Math.floor(xpos), j0 = Math.floor(ypos);
			i1 = i0+1, j1 = j0+1;
			s1 = (xpos - i0), s0 = 1-s1;
			t1 = (ypos - j0), t0 = 1-t1;
			u[idx(i,j)] = s0*(t0*uOld[idx(i0,j0)]+t1*uOld[idx(i0,j1)])+s1*(t0*uOld[idx(i1,j0)]+t1*uOld[idx(i1,j1)]);
			v[idx(i,j)] = s0*(t0*vOld[idx(i0,j0)]+t1*vOld[idx(i0,j1)])+s1*(t0*vOld[idx(i1,j0)]+t1*vOld[idx(i1,j1)]);
		}
	}
	setVelocityBoundary();
}
function project(){
	h0 = h;
	for ( i=1 ; i<=N ; i++ ) { 
		for ( j=1 ; j<=N ; j++ ) { 
			vOld[idx(i,j)] = -0.5*h0*(u[idx(i+1,j)]-u[idx(i-1,j)]+v[idx(i,j+1)]-v[idx(i,j-1)]); 
			uOld[idx(i,j)] = 0; 
		} 
	} 
	setVelocityBoundary2();
 
	for ( k=0 ; k<20 ; k++ ) { 
		for ( i=1 ; i<=N ; i++ ) { 
			for ( j=1 ; j<=N ; j++ ) { 
				uOld[idx(i,j)] = (vOld[idx(i,j)]+uOld[idx(i-1,j)]+uOld[idx(i+1,j)]+ 
				uOld[idx(i,j-1)]+uOld[idx(i,j+1)])/4; 
			} 
		} 
		setVelocityBoundary2(); 
	} 
 
	for ( i=1 ; i<=N ; i++ ) { 
		for ( j=1 ; j<=N ; j++ ) { 
			u[idx(i,j)] -= 0.5*(uOld[idx(i+1,j)]-uOld[idx(i-1,j)])/h0; 
			v[idx(i,j)] -= 0.5*(uOld[idx(i,j+1)]-uOld[idx(i,j-1)])/h0; 
		} 
	} 
	setVelocityBoundary(); 
}

//print functions//
function updatePrint(){
	for (i = 1; i<=N; i++){
		for (j = 1; j <= N; j++){
			g = Math.floor(dens[idx(i,j)]*15);
			//if(G[idx(i,j)] != g) {
				//G[idx(i,j)] = g;
				var f = hex[g];
				var colour = "#" + f + "2" + "4";
				//print.clearRect((i-1)*h, (j-1)*h, h, h);
				print.fillStyle = colour;	
				print.fillRect((i-1)*h, (j-1)*h, h+1, h+1);	
			//}
		}
	}
}

function setG(){
	for (i = 1; i<=N; i++){
		for (j = 1; j <= N; j++){
			g = Math.floor(dens[idx(i,j)]*15);
			G[idx(i,j)] = g;
		}
	}
}

//housekeeping functions//
function idx(i, j){
	return i+(N+2)*j;
}
function setBoundary(){
	for (i = 1; i <= N; i++){
		dens[idx(0,i)] = dens[idx(1,i)];
		dens[idx(N+1,i)] = dens[idx(N,i)];
		dens[idx(i,0)] = dens[idx(i,1)];
		dens[idx(i,N+1)] = dens[idx(i,N)];
	}
	dens[idx(0,0)] = .5*(dens[idx(0,1)] + dens[idx(1,0)]);
	dens[idx(0,N+1)] = .5*(dens[idx(1,N+1)] + dens[idx(0,N)]);
	dens[idx(N+1,0)] = .5*(dens[idx(N,0)] + dens[idx(N+1,1)]);
	dens[idx(N+1, N+1)] = .5*(dens[idx(N,N+1)] + dens[idx(N+1,N)]);
	
	/*for (i = 1; i<=N; i++){
		for (j = 1; j <= N; j++){
			if((i-N/2)*(i-N/2)+(j-N/2)*(j-N/2) < 100){
				dens[idx(i,j)] = 0;
			}
		}
	}*/
}
function setVelocityBoundary(){
	for (i = 1; i <= N; i++){
		u[idx(0,i)] = -u[idx(1,i)];
		u[idx(N+1,i)] = -u[idx(N,i)];
		u[idx(i,0)] = u[idx(i,1)];
		u[idx(i,N+1)] = u[idx(i,N)];
		v[idx(0,i)] = v[idx(1,i)];
		v[idx(N+1,i)] = v[idx(N,i)];
		v[idx(i,0)] = -v[idx(i,1)];
		v[idx(i,N+1)] = -v[idx(i,N)];
	}
	
	u[idx(0,0)] = .5*(u[idx(0,1)] + u[idx(1,0)]);
	u[idx(0,N+1)] = .5*(u[idx(1,N+1)] + u[idx(0,N)]);
	u[idx(N+1,0)] = .5*(u[idx(N,0)] + u[idx(N+1,1)]);
	u[idx(N+1, N+1)] = .5*(u[idx(N,N+1)] + u[idx(N+1,N)]);
	
	v[idx(0,0)] = .5*(v[idx(0,1)] + v[idx(1,0)]);
	v[idx(0,N+1)] = .5*(v[idx(1,N+1)] + v[idx(0,N)]);
	v[idx(N+1,0)] = .5*(v[idx(N,0)] + v[idx(N+1,1)]);
	v[idx(N+1, N+1)] = .5*(v[idx(N,N+1)] + v[idx(N+1,N)]);
}
function setVelocityBoundary2(){
	for (i = 1; i <= N; i++){
		uOld[idx(0,i)] = uOld[idx(1,i)];
		uOld[idx(N+1,i)] = uOld[idx(N,i)];
		uOld[idx(i,0)] = uOld[idx(i,1)];
		uOld[idx(i,N+1)] = uOld[idx(i,N)];
		vOld[idx(0,i)] = vOld[idx(1,i)];
		vOld[idx(N+1,i)] = vOld[idx(N,i)];
		vOld[idx(i,0)] = vOld[idx(i,1)];
		vOld[idx(i,N+1)] = vOld[idx(i,N)];
	}
	
	uOld[idx(0,0)] = .5*(uOld[idx(0,1)] + uOld[idx(1,0)]);
	uOld[idx(0,N+1)] = .5*(uOld[idx(1,N+1)] + uOld[idx(0,N)]);
	uOld[idx(N+1,0)] = .5*(uOld[idx(N,0)] + uOld[idx(N+1,1)]);
	uOld[idx(N+1, N+1)] = .5*(uOld[idx(N,N+1)] + uOld[idx(N+1,N)]);
	
	vOld[idx(0,0)] = .5*(vOld[idx(0,1)] + vOld[idx(1,0)]);
	vOld[idx(0,N+1)] = .5*(vOld[idx(1,N+1)] + vOld[idx(0,N)]);
	vOld[idx(N+1,0)] = .5*(vOld[idx(N,0)] + vOld[idx(N+1,1)]);
	vOld[idx(N+1, N+1)] = .5*(vOld[idx(N,N+1)] + vOld[idx(N+1,N)]);
}
function copy(to,from){
	for(var i=0; i<N+2; i++){
		for(var j=0; j<N+2; j++){
			to[idx(i,j)]=from[idx(i,j)];
		}
	}
}

//mousekeeping functions//
var xmin = window.innerWidth/2 - 300, ymin = 10;
document.onmousemove = mouse;
function mouse(event){
	xOld=x, yOld=y;
	x = event.clientX, y = event.clientY;
	if(x>xmin&&y>ymin&&x<xmin+h*N&&y<ymin+h*N){
		x = Math.ceil((x-xmin)/h);
		y = Math.ceil((y-ymin)/h);
		uxy = (x-xOld)*dt;
		vxy = (y-yOld)*dt;
	} else {
		x = -1, y = -1;
		uxy = 0, vxy = 0;
	}
}
