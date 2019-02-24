const WebSocket = require('ws');
const uuid = require('uuid/v4');
const config = require('./config');
const createCtx = require('./ctx');

/**
 * @typedef {function(ctx, NextMiddlewareFn)} middleware
 * @callback middleware
 * @param {ctx} ctx Context object for the connection
 * @param {NextMiddlewareFn} next Callback function that triggers the next middleware
 */

/**
 * HexNut server instance
 */
class HexNut {

  /**
   * Create a new HexNut instance
   * @param {object} wsConfig - Config object, mixed with defaults, passed to Websocket.Server constructor
   */
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

  /**
   * Adds a middleware function to the HexNut instance
   * @method
   * @param {middleware} middleware
   */
  use(middleware) {
    this.middleware.push(middleware);
  }

  /**
   * Start the HexNut Websocket Server
   */
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

  /**
   * @private
   * @param {Error} err
   * @param {Context} ctx
   */
  onError(err, ctx) {
    if (typeof this.onerror === 'function') {
      return this.onerror(err, ctx);
    }
  }

  /**
   * @private
   * @param {Context} ctx
   */
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