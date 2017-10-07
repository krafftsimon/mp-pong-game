webpackJsonp(["main"],{

/***/ "../../../../../src/$$_gendir lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "../../../../../src/$$_gendir lazy recursive";

/***/ }),

/***/ "../../../../../src/app/app.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "canvas {\r\n  border: 1px solid red;\r\n  margin: 40px auto;\r\n  display: block;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<h1> You are in room {{roomNum}}, and are player {{clientPlayerNum}}</h1>\n<canvas #gameCanvas width=\"800\" height=\"600\"></canvas>\n"

/***/ }),

/***/ "../../../../../src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__game_service__ = __webpack_require__("../../../../../src/app/game.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__player__ = __webpack_require__("../../../../../src/app/player.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ball__ = __webpack_require__("../../../../../src/app/ball.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AppComponent = (function () {
    function AppComponent(gameService) {
        this.gameService = gameService;
        this.updateRate = 50; //in hertz
        this.directionP1 = 0;
        this.interpolationInputs = [];
        this.pendingInputs = []; //Inputs awaiting to be confirmed by the server
        this.ballSteps = [];
        this.player1 = new __WEBPACK_IMPORTED_MODULE_2__player__["a" /* Player */](20);
        this.player2 = new __WEBPACK_IMPORTED_MODULE_2__player__["a" /* Player */](760);
        this.ball = new __WEBPACK_IMPORTED_MODULE_3__ball__["a" /* Ball */];
    }
    AppComponent.prototype.keyUp = function (event) {
        if (event.keyCode === 38) {
            this.directionP1 = -1;
        }
        else if (event.keyCode === 40) {
            this.directionP1 = 1;
        }
    };
    AppComponent.prototype.keyDown = function (event) {
        if (event.keyCode === 38) {
            this.directionP1 = 0;
        }
        else if (event.keyCode === 40) {
            this.directionP1 = 0;
        }
    };
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.gameService.connect().subscribe(function (data) { return _this.roomNum = data; }, function (error) { return console.log(error); }, function () { return console.log("Completed."); });
        this.gameService.getPlayerNumber().subscribe(function (data) { return _this.clientPlayerNum = data; }, function (error) { return console.log(error); }, function () { return console.log("Completed."); });
        this.setUpdateRate(this.updateRate);
    };
    AppComponent.prototype.setUpdateRate = function (frequency) {
        clearInterval(this.updateInterval);
        this.updateInterval = setInterval((function (self) {
            return function () { self.updateGame(); };
        })(this), 1000 / frequency);
    };
    AppComponent.prototype.updateGame = function () {
        this.processServerData();
        this.processUserInputs();
        this.interpolate();
        this.drawCanvas();
    };
    AppComponent.prototype.processServerData = function () {
        var _this = this;
        this.gameService.getState().subscribe(function (data) {
            // Reconciliation.
            if (_this.clientPlayerNum === 1) {
                _this.interpolationInputs = data[_this.roomNum - 1].inputsP2; // Save inputs of other player for interpolation
                var inputs = data[_this.roomNum - 1].inputsP1;
                // Verify that client prediction matches server
                for (var i in inputs) {
                    if (inputs[i].result != _this.pendingInputs[i].predictedPosition) {
                        _this.player1.y = data[_this.roomNum - 1].player1.y;
                    }
                }
                _this.pendingInputs = [];
            }
            if (_this.clientPlayerNum === 2) {
                _this.interpolationInputs = data[_this.roomNum - 1].inputsP1; // Save inputs of other player for interpolation
                var inputs = data[_this.roomNum - 1].inputsP2;
                // Verify that client prediction matches server
                for (var i in inputs) {
                    if (inputs[i].result != _this.pendingInputs[i].predictedPosition) {
                        _this.player2.y = data[_this.roomNum - 1].player2.y;
                    }
                }
                _this.pendingInputs = [];
            }
            _this.ballSteps = data[_this.roomNum - 1].ballSteps; // Save ball steps for interpolation
        });
    };
    AppComponent.prototype.processUserInputs = function () {
        var input = { direction: this.directionP1, playerNum: this.clientPlayerNum, roomNum: this.roomNum };
        if (typeof this.roomNum != 'undefined') {
            this.gameService.sendUserInput(input);
        }
        // Client-side prediction.
        if (this.clientPlayerNum === 1) {
            this.player1.applyInput(input);
            //Store the input and the result of the prediction for reconciliation
            this.pendingInputs.push({ input: input, predictedPosition: this.player1.y });
        }
        else {
            this.player2.applyInput(input);
            //Store the input and the result of the prediction for reconciliation
            this.pendingInputs.push({ input: input, predictedPosition: this.player2.y });
        }
    };
    AppComponent.prototype.interpolate = function () {
        this.ball.x = this.ballSteps[0].x;
        this.ball.y = this.ballSteps[0].y;
        this.ballSteps.shift();
        if (this.clientPlayerNum === 1) {
            this.player2.applyInput(this.interpolationInputs[0]);
            this.interpolationInputs.shift();
        }
        if (this.clientPlayerNum === 2) {
            this.player1.applyInput(this.interpolationInputs[0]);
            this.interpolationInputs.shift();
        }
    };
    AppComponent.prototype.drawCanvas = function () {
        var context = this.canvas.nativeElement.getContext("2d");
        context.clearRect(0, 0, 800, 600);
        context.beginPath();
        context.rect(this.player1.x, this.player1.y, 20, 100);
        context.rect(this.player2.x, this.player2.y, 20, 100);
        context.stroke();
        context.beginPath();
        context.arc(this.ball.x, this.ball.y, 5, 0, 2 * Math.PI);
        context.stroke();
    };
    return AppComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_12" /* ViewChild */])("gameCanvas"),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* ElementRef */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* ElementRef */]) === "function" && _a || Object)
], AppComponent.prototype, "canvas", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* HostListener */])('window:keydown', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppComponent.prototype, "keyUp", null);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* HostListener */])('window:keyup', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppComponent.prototype, "keyDown", null);
AppComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'app-root',
        template: __webpack_require__("../../../../../src/app/app.component.html"),
        styles: [__webpack_require__("../../../../../src/app/app.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__game_service__["a" /* GameService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__game_service__["a" /* GameService */]) === "function" && _b || Object])
], AppComponent);

var _a, _b;
//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ "../../../../../src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__("../../../platform-browser/@angular/platform-browser.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_component__ = __webpack_require__("../../../../../src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__game_service__ = __webpack_require__("../../../../../src/app/game.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["L" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2__app_component__["a" /* AppComponent */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */]
        ],
        providers: [__WEBPACK_IMPORTED_MODULE_3__game_service__["a" /* GameService */]],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_2__app_component__["a" /* AppComponent */]]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ "../../../../../src/app/ball.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Ball; });
var Ball = (function () {
    function Ball() {
        this.x = 20;
        this.y = 20;
        this.xspeed = 10;
        this.yspeed = 10;
        this.positionBuffer = [];
    }
    Ball.prototype.move = function () {
        this.x += this.xspeed;
        this.y += this.yspeed;
        if (this.y > 595) {
            this.yspeed = -this.yspeed;
        }
        if (this.x > 795) {
            this.xspeed = -this.xspeed;
        }
        if (this.y < 5) {
            this.yspeed = -this.yspeed;
        }
        if (this.x < 5) {
            this.xspeed = -this.xspeed;
        }
        //if (this.x < 50 && rooms[i].yBall > rooms[i].yP1 && rooms[i].yBall < rooms[i].yP1 + 100) {
        //  rooms[i].dx = -rooms[i].dx;
        //}
    };
    return Ball;
}());

//# sourceMappingURL=ball.js.map

/***/ }),

/***/ "../../../../../src/app/game.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GameService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__ = __webpack_require__("../../../../rxjs/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_socket_io_client__ = __webpack_require__("../../../../socket.io-client/lib/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_socket_io_client___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_socket_io_client__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var GameService = (function () {
    function GameService() {
        this.devUrl = 'http://localhost:4400';
        this.prodUrl = 'http://35.193.240.128:4400';
        this.url = this.devUrl;
    }
    GameService.prototype.connect = function () {
        var _this = this;
        var observable = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"](function (observer) {
            _this.socket = __WEBPACK_IMPORTED_MODULE_2_socket_io_client__(_this.url);
            _this.socket.on('connectToRoom', function (data) {
                observer.next(data);
            });
        });
        return observable;
    };
    GameService.prototype.getPlayerNumber = function () {
        var _this = this;
        var observable = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"](function (observer) {
            _this.socket.on('playerNumber', function (data) {
                observer.next(data);
            });
        });
        return observable;
    };
    GameService.prototype.sendUserInput = function (input) {
        this.socket.emit('userInput', input);
    };
    GameService.prototype.getState = function () {
        var _this = this;
        var observable = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"](function (observer) {
            _this.socket.on('gameState', function (data) {
                observer.next(data);
            });
        });
        return observable;
    };
    return GameService;
}());
GameService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])()
], GameService);

//# sourceMappingURL=game.service.js.map

/***/ }),

/***/ "../../../../../src/app/player.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Player; });
var Player = (function () {
    function Player(x) {
        this.y = 250;
        this.speed = 10;
        this.positionBuffer = [];
        this.x = x;
    }
    Player.prototype.applyInput = function (input) {
        this.y += input.direction * this.speed;
        if (this.y > 500) {
            this.y = 500;
        }
        else if (this.y < 0) {
            this.y = 0;
        }
    };
    return Player;
}());

//# sourceMappingURL=player.js.map

/***/ }),

/***/ "../../../../../src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// The file contents for the current environment will overwrite these during build.
var environment = {
    production: false
};
//# sourceMappingURL=environment.js.map

/***/ }),

/***/ "../../../../../src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__("../../../platform-browser-dynamic/@angular/platform-browser-dynamic.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__("../../../../../src/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("../../../../../src/environments/environment.ts");




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_19" /* enableProdMode */])();
}
Object(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */])
    .catch(function (err) { return console.log(err); });
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("../../../../../src/main.ts");


/***/ }),

/***/ 1:
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map