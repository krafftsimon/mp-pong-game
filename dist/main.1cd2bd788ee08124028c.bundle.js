webpackJsonp([1],{0:function(t,n,e){t.exports=e("cDNt")},1:function(t,n){},cDNt:function(t,n,e){"use strict";function i(t){return o._19(0,[o._16(402653184,1,{canvas:0}),(t()(),o._4(0,null,null,1,"h1",[],null,null,null,null,null)),(t()(),o._18(null,[" You are in room ",", and are player ",""])),(t()(),o._18(null,["\n"])),(t()(),o._4(0,null,null,1,"h1",[],null,null,null,null,null)),(t()(),o._18(null,[" pending inputs: ",""])),(t()(),o._18(null,["\n"])),(t()(),o._4(0,[[1,0],["gameCanvas",1]],null,0,"canvas",[["height","600"],["width","800"]],null,null,null,null,null)),(t()(),o._18(null,["\n"]))],null,function(t,n){var e=n.component;t(n,2,0,e.roomNum,e.clientPlayerNum),t(n,5,0,e.pendingInputs)})}function s(t){return o._19(0,[(t()(),o._4(0,null,null,1,"app-root",[],null,[["window","keydown"],["window","keyup"]],function(t,n,e){var i=!0;if("window:keydown"===n){i=!1!==o._15(t,1).keyUp(e)&&i}if("window:keyup"===n){i=!1!==o._15(t,1).keyDown(e)&&i}return i},i,v)),o._2(4308992,null,0,y,[c,o.F],null,null)],function(t,n){t(n,1,0)},null)}Object.defineProperty(n,"__esModule",{value:!0});var o=e("/oeL"),a={production:!0},r=function(){function t(){}return t}(),h=e("bKpL"),l=e("MjLF"),c=function(){function t(){this.devUrl="http://localhost:4400",this.prodUrl="http://35.193.240.128:4400",this.url=this.prodUrl}return t.prototype.connect=function(){var t=this;return new h.Observable(function(n){t.socket=l(t.url),t.socket.on("connectToRoom",function(t){n.next(t)})})},t.prototype.getPlayerNumber=function(){var t=this;return new h.Observable(function(n){t.socket.on("playerNumber",function(t){n.next(t)})})},t.prototype.sendUserInput=function(t){this.socket.emit("userInput",t)},t.prototype.getState=function(){var t=this;return new h.Observable(function(n){t.socket.on("gameState",function(t){n.next(t)})})},t}(),u=function(){function t(t){this.y=250,this.speed=10,this.positionBuffer=[],this.x=t}return t.prototype.applyInput=function(t){this.y+=t.direction*this.speed,this.y>500?this.y=500:this.y<0&&(this.y=0)},t}(),p=function(){function t(){this.x=20,this.y=20,this.xSpeed=5,this.ySpeed=5,this.positionBuffer=[]}return t.prototype.move=function(t,n){this.x+=this.xSpeed,this.y+=this.ySpeed,this.y>595&&(this.ySpeed=-this.ySpeed),this.x>795&&(this.xSpeed=-this.xSpeed),this.y<5&&(this.ySpeed=-this.ySpeed),this.x<5&&(this.x=400,this.y=250),this.x<=45&&this.x>=40&&this.y+5>=t.y&&this.y-5<=t.y+100||this.x>=755&&this.x<=760&&this.y+5>=n.y&&this.y-5<=n.y+100?this.xSpeed=-this.xSpeed:(this.x>=20&&this.x<=40&&this.y+5>=t.y&&this.y<=t.y+10||this.x>=20&&this.x<=40&&this.y-5<=t.y+100&&this.y>=t.y+90||this.x>=760&&this.x<=780&&this.y+5>=n.y&&this.y<=n.y+10||this.x>=760&&this.x<=780&&this.y-5<=n.y+100&&this.y>=n.y+90)&&(this.ySpeed=-this.ySpeed)},t}(),y=function(){function t(t,n){this.gameService=t,this.renderer=n,this.updateRate=50,this.direction=0,this.ballMovementCounter=0,this.interpolationInputs=[],this.pendingInputs=[],this.ballSteps=[],this.inputNumber=0,this.menuScreen=!0,this.connectBtnX=300,this.connectBtnY=300,this.connectBtnWidth=100,this.connectBtnLength=200,this.countDown="3",this.countDownStarted=!1,this.pointsP1="0",this.pointsP2="0",this.player1=new u(20),this.player2=new u(760),this.ball=new p,this.ball2=new p}return t.prototype.keyUp=function(t){38===t.keyCode?this.direction=-1:40===t.keyCode&&(this.direction=1)},t.prototype.keyDown=function(t){38===t.keyCode?this.direction=0:40===t.keyCode&&(this.direction=0)},t.prototype.ngOnInit=function(){var t=this;this.renderer.listen(this.canvas.nativeElement,"click",function(n){t.menuScreen&&n.layerX>=t.connectBtnX&&n.layerY>=t.connectBtnY&&n.layerX<=t.connectBtnX+t.connectBtnLength&&n.layerY<=t.connectBtnX+t.connectBtnWidth&&(t.menuScreen=!1,t.startGame())})},t.prototype.ngAfterViewInit=function(){this.canvasCtx=this.canvas.nativeElement.getContext("2d"),this.drawMenu()},t.prototype.startGame=function(){var t=this;this.gameService.connect().subscribe(function(n){return t.roomNum=n},function(t){return console.log(t)},function(){return console.log("Completed.")}),this.gameService.getPlayerNumber().subscribe(function(n){return t.clientPlayerNum=n},function(t){return console.log(t)},function(){return console.log("Completed.")}),this.subscribeToServer(),this.setUpdateRate(this.updateRate)},t.prototype.setUpdateRate=function(t){clearInterval(this.updateInterval),this.updateInterval=setInterval(function(t){return function(){t.updateGame()}}(this),1e3/t)},t.prototype.updateGame=function(){"starting"!==this.serverData.gameState||this.countDownStarted||(this.startCountDown(),this.countDownStarted=!0),"started"===this.serverData.gameState&&(this.processServerData(),this.processUserInputs(),this.interpolate()),this.drawGame()},t.prototype.subscribeToServer=function(){var t=this;this.gameService.getState().subscribe(function(n){t.serverData=n[t.roomNum-1],t.ballMovementCounter=0},function(t){return console.log(t)},function(){return console.log("Completed.")})},t.prototype.processServerData=function(){if(1===this.clientPlayerNum){this.player1.y=this.serverData.player1.y,this.interpolationInputs=this.serverData.inputsP2;for(var t=0;t<this.pendingInputs.length;)this.pendingInputs[t].inputNumber<=this.serverData.lastProcessedInputP1?this.pendingInputs.splice(t,1):(this.player1.applyInput(this.pendingInputs[t]),t++)}else if(2===this.clientPlayerNum){this.player2.y=this.serverData.player2.y,this.interpolationInputs=this.serverData.inputsP1;for(var t=0;t<this.pendingInputs.length;)this.pendingInputs[t].inputNumber<=this.serverData.lastProcessedInputP2?this.pendingInputs.splice(t,1):(this.player2.applyInput(this.pendingInputs[t]),t++)}},t.prototype.processUserInputs=function(){if(this.ball.x=this.serverData.ball.x,this.ball.y=this.serverData.ball.y,0!==this.direction){var t={direction:this.direction,inputNumber:this.inputNumber++,playerNum:this.clientPlayerNum,roomNum:this.roomNum};void 0!==this.roomNum&&this.gameService.sendUserInput(t),1===this.clientPlayerNum?(this.player1.applyInput(t),this.pendingInputs.push(t)):(this.player2.applyInput(t),this.pendingInputs.push(t))}},t.prototype.interpolate=function(){this.interpolationInputs.length>0&&(1===this.clientPlayerNum?(this.player2.applyInput(this.interpolationInputs[0]),this.interpolationInputs.shift()):2===this.clientPlayerNum&&(this.player1.applyInput(this.interpolationInputs[0]),this.interpolationInputs.shift()))},t.prototype.startCountDown=function(){setTimeout(function(){this.countDown="2"}.bind(this),1e3),setTimeout(function(){this.countDown="1"}.bind(this),2e3),setTimeout(function(){this.countDown="3",this.countDownStarted=!1}.bind(this),3e3)},t.prototype.drawGame=function(){this.canvasCtx.clearRect(0,0,800,600);var t=this.canvasCtx.createRadialGradient(400,300,80,400,300,600);t.addColorStop(0,"#e5e5e5"),t.addColorStop(1,"#b2b2b2"),this.canvasCtx.fillStyle=t,this.canvasCtx.fillRect(0,0,800,600),this.canvasCtx.shadowBlur=0,this.canvasCtx.shadowOffsetY=0,this.canvasCtx.shadowOffsetX=0,this.canvasCtx.shadowColor="grey",this.canvasCtx.beginPath(),this.canvasCtx.moveTo(400,0),this.canvasCtx.lineTo(400,600),this.canvasCtx.stroke(),"waitingForPlayer"===this.serverData.gameState&&(this.canvasCtx.fillStyle="black",this.canvasCtx.font="30px Comic Sans MS",this.canvasCtx.fillText("Waiting for an opponent.",220,300)),"starting"===this.serverData.gameState&&(this.canvasCtx.fillStyle="black",this.canvasCtx.font="60px Comic Sans MS",this.canvasCtx.fillText(this.countDown,380,300)),this.canvasCtx.shadowBlur=10,this.canvasCtx.shadowOffsetY=10,this.canvasCtx.shadowOffsetX=10,this.canvasCtx.shadowColor="grey",this.canvasCtx.beginPath(),this.canvasCtx.fillStyle="#68EFAD",this.canvasCtx.lineWidth=1,this.canvasCtx.strokeStyle="grey",this.canvasCtx.arc(this.ball.x,this.ball.y,10,0,2*Math.PI),this.canvasCtx.fill(),this.canvasCtx.stroke(),this.canvasCtx.font="40px Comic Sans MS",this.canvasCtx.fillText(this.serverData.pointsP1,300,40),this.canvasCtx.fillText(this.serverData.pointsP2,475,40),this.canvasCtx.beginPath(),this.canvasCtx.fillStyle="#691A99",this.canvasCtx.lineWidth=2,this.canvasCtx.strokeStyle="grey",this.canvasCtx.rect(this.player1.x,this.player1.y,20,105),this.canvasCtx.rect(this.player2.x,this.player2.y,20,105),this.canvasCtx.fill(),this.canvasCtx.stroke()},t.prototype.drawMenu=function(){this.canvasCtx.fillStyle="#e5e5e5",this.canvasCtx.fillRect(0,0,800,600),this.canvasCtx.fillStyle="black",this.canvasCtx.font="40px Comic Sans MS",this.canvasCtx.fillText("Online Multiplayer Pong Game",120,80),this.canvasCtx.fillText("Connect",this.connectBtnX+25,this.connectBtnY+60),this.canvasCtx.rect(this.connectBtnX,this.connectBtnY,this.connectBtnLength,this.connectBtnWidth),this.canvasCtx.stroke()},t.ctorParameters=function(){return[{type:c},{type:o.F}]},t}(),d=["canvas[_ngcontent-%COMP%]{box-shadow:0 0 10px 2px #691a99;margin:40px auto;display:block}"],f=[d],v=o._1({encapsulation:0,styles:f,data:{}}),x=o.Z("app-root",y,s,{},{},[]),m=e("qbdv"),C=e("fc+i"),b=o._0(r,[y],function(t){return o._13([o._14(512,o.i,o.X,[[8,[x]],[3,o.i],o.x]),o._14(5120,o.v,o._12,[[3,o.v]]),o._14(4608,m.d,m.c,[o.v]),o._14(4608,o.h,o.h,[]),o._14(5120,o.a,o._5,[]),o._14(5120,o.t,o._10,[]),o._14(5120,o.u,o._11,[]),o._14(4608,C.b,C.s,[m.b]),o._14(6144,o.I,null,[C.b]),o._14(4608,C.e,C.f,[]),o._14(5120,C.c,function(t,n,e,i){return[new C.k(t),new C.o(n),new C.n(e,i)]},[m.b,m.b,m.b,C.e]),o._14(4608,C.d,C.d,[C.c,o.z]),o._14(135680,C.m,C.m,[m.b]),o._14(4608,C.l,C.l,[C.d,C.m]),o._14(6144,o.G,null,[C.l]),o._14(6144,C.p,null,[C.m]),o._14(4608,o.M,o.M,[o.z]),o._14(4608,C.g,C.g,[m.b]),o._14(4608,C.i,C.i,[m.b]),o._14(4608,c,c,[]),o._14(512,m.a,m.a,[]),o._14(1024,o.l,C.q,[]),o._14(1024,o.b,function(t,n){return[C.r(t,n)]},[[2,C.h],[2,o.y]]),o._14(512,o.c,o.c,[[2,o.b]]),o._14(131584,o._3,o._3,[o.z,o.Y,o.r,o.l,o.i,o.c]),o._14(2048,o.e,null,[o._3]),o._14(512,o.d,o.d,[o.e]),o._14(512,C.a,C.a,[[3,C.a]]),o._14(512,r,r,[])])});a.production&&Object(o.S)(),Object(C.j)().bootstrapModuleFactory(b).catch(function(t){return console.log(t)})},gFIY:function(t,n){function e(t){return Promise.resolve().then(function(){throw new Error("Cannot find module '"+t+"'.")})}e.keys=function(){return[]},e.resolve=e,t.exports=e,e.id="gFIY"}},[0]);