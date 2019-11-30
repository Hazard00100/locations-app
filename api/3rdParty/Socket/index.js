'use strict'

const io                  = require('socket.io');
const path                = require('path');
const _                   = require('underscore');
const { decode }          = require('../auth/auth');
const mName               = 'APPROVE_PLACE';

let
  socketConnect = null,
  socketServer    = null,
  socketInit      = (server) => {
  socketServer = io(server, {
    serveClient: false,
    pingInterval: 50000,
    pingTimeout: 25000
  });

  /** Middleware Validate Token **/
  socketServer.use((socket, next) => {
    const token = socket.handshake.query.token;
    if (token) {
      const d = decode(token, null);
      if (d) {
        console.log('Verify Client good Token ');
        return next();
      } else {
        console.log('Verify Client Token error ');
        return next(new Error('Verify Token error'));
      }
    } else {
      console.log('Please provide client Token for verify!');
    }
  })

  socketConnect = socketServer.sockets.connected;

  socketServer.on('error', (err) => {
    console.log('io on error', err);
  })

  /** Hand some thing when socket connect **/
  socketServer.on('connection', client => {
    const userId = decode(client.handshake.query.token, null).id
    console.log('The connect with userId = ' + userId + ' socketId = ' + client.id);

    /** save client when connect **/
    client.userData = {
      room: {},
      connected: true,
      socketId: client.id,
      isAdmin: client.isAdmin,
      userId,
      token: client.handshake.query.token
    };

    client.emit('SUCCESS_CONNECT', client.userData);

    client.on('test', (d) => {
      const dtRoom = JSON.parse(d);
      console.log('test', d._id);
    });

    client.on('disconnect', () => {
      console.log('listening client disconnect', JSON.stringify(client.userData, 2, 2));
    });
  });

  return socketServer;
};

const handleGetSKIDFromUID = m => {
  try {
    Object.keys(socketServer.sockets.connected).map(k => {
      const ds = socketServer.sockets.connected[k];
      if (ds.userData.userId === m.userId) {
        console.log(' handleGetSKIDFromUID ', ds.userData.userId , m.userId);
        ds.emit(mName, m);
      }
    });
  } catch (ex) {
    console.log(ex);
  }

};

const emitApprovePlace = m => handleGetSKIDFromUID(m);

module.exports = {
  socketInit,
  emitApprovePlace
};
