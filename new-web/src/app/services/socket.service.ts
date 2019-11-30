/**
 * @author: tpt2213@gmail.com
 *
 * @explain: Wrap the socket io client for handle real-time
 * @contact: Any question don't hestinate send to me an email
 *
 * **/

import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { Globals } from '../../globals';

@Injectable()
export default class SocketService {
  t2SK: any;

  constructor(
    private globals: Globals,
  ) { }

  initSocket(isAdmin: boolean) {
    const cf = {
      url: this.globals.API_URL,
      options: {
        query: {
          token: localStorage.getItem('token'),
          isAdmin: localStorage.getItem('admin') === 'false' ? false : true,
        },
      }
    };
    this.t2SK = io(cf.url, cf.options);
    this.t2SK.on('connect', () => {
      console.log('socket ==> connect');
    });
    this.t2SK.on('event', (data) => {
      console.log(data);
    });
    this.t2SK.on('SUCCESS_CONNECT', (data) => {
      console.log(data);
      localStorage.setItem('socketId', data.socketId);
    });
    /** ** HANLDE CONNECTION *****/
    this.t2SK.on('reconnect', (attemptNumber) => {
      console.log('reconnect', attemptNumber);
    });

    this.t2SK.on('disconnect', () => {
      console.log('socket ==> disconnect');
    });
  }

  getSK() {
    return this.t2SK;
  }
}
