const WebSocket = require('ws');
const uuid = require('uuid/v4');
const config = require('./config');
const createCtx = require('./ctx');

class HexNut {
  constructor(wsConfig = {}) {
    this.config = {
      ...config,
      ...wsConfig
    };
    this.server = null;
    this.isRunning = false;
    this.middleware = [];
    this.connections = {};
  }

  use(middleware) {
    this.middleware.push(middleware);
  }

  start() {
    this.server = new WebSocket.Server(this.config);
    this.isRunning = true;

    this.server.on('connection', (ws, req) => {
      const id = uuid();
      const curCtx = createCtx(ws, req, this);
      this.connections[id] = curCtx;

      this.runMiddleware(curCtx);

      ws.on('message', message => {
        curCtx._reset(message);
        this.runMiddleware(curCtx);
      });

      ws.on('close', () => {
        delete this.connections[id];
      });
    });
  }

  onError(err, ctx) {
    if (typeof this.onerror === 'function') {
      return this.onerror(err, ctx);
    }
  }

  runMiddleware(ctx) {
    let i = 0;
    const run = async idx => {
      if (!ctx.isComplete && typeof this.middleware[idx] === 'function') {
        return await this.middleware[idx](ctx, () => run(idx+1));
      }
    };
    return run(i).catch(err => this.onError(err, ctx));
  }
}

module.exports = HexNut;