import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class GameService {
  private devUrl = 'http://localhost:4400';
  private prodUrl = 'http://pong.krafftsimon.com';
  private url = this.prodUrl;
  private socket;

  connect() {
    let observable = new Observable(observer => {
        this.socket = io(this.url);
        this.socket.on('connectToRoom', (data) => {
          observer.next(data);
        });
    });
    return observable;
  }

  getPlayerNumber() {
    let observable = new Observable(observer => {
        this.socket.on('playerNumber', (data) => {
          observer.next(data);
        });
    });
    return observable;
  }

  sendUserInput(input: Object) {
    this.socket.emit('userInput', input);
  }


  getState() {
    let observable = new Observable(observer => {
      this.socket.on('gameState', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  getBallPosition() {
    let observable = new Observable(observer => {
      this.socket.on('ballPosition',  (data) => {
        observer.next(data);
      });
    });
    return observable;
  }
}
