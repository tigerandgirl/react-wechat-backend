/**
 * websocket 相关的路由
 * @File   : websocket.js
 * @Author : Richard (xiaowei.hsueh@gmail.com)
 * @Link   : http://www.gistop.com/
 * @Date   : 2018-6-18 13:49:58
 */

const router = require('koa-router');

const websocket = router();
const sockets = new Map();

websocket.get('/*', async(ctx, next) => {
  sockets.add(ctx.websocket);
  ctx.websocket.send(JSON.stringify({
    type: 'init',
    data: {}
  }));
  ctx.websocket.on('message', message => {
    const msg = JSON.parse(message);
    switch (msg.type) {
      case 'candidate':
        sendCandidate(ctx.websocket, message);
        break;
      default:
        break;
    }
  });
  ctx.websocket.on('close', () => {
    sockets.delete(ctx.websocket);
    console.log('closed');
  });
  await next;
});

const sendCandidate = (socket, message) => {
  sockets.forEach(s => {
    if (s !== socket) {
      socket.send(message);
    }
  });
};

module.exports = websocket;
