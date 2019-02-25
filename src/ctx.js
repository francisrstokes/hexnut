const {
  SOCKET_SYMBOL,
  REQUEST_SYMBOL
} = require('./symbols');

/**
 * @class
 * Context object representing a HexNut connection
 */
const ctx = {
  /**
   * @private
   */
  _reset(message) {
    this.type = 'message';
    this.isComplete = false;
    this.message = message;
  },

  /**
   * Send a message to the client
   * @param {*} data
   * @method
   */
  send(...args) {
    this[SOCKET_SYMBOL].send(...args);
    return this;
  },

  /**
   * Send a message to all connected clients
   * @param {*} data
   */
  sendToAll(...args) {
    Object.values(this.app.connections).forEach(ctx =>
      ctx[SOCKET_SYMBOL].send(...args)
    );
    return this;
  },

  /**
   * Short circuit all remaining middleware
   */
  done() {
    this.isComplete = true;
    return this;
  },

  /**
   * Throw an error
   * @param {Error} err
   */
  throw(err) {
    throw err;
  },

  /**
   * True if this activation of the middlware chain is a new connection
   */
  get isConnection() {
    return this.type === 'connection';
  },

  /**
   * True if this activation of the middlware chain is a new message
   */
  get isMessage() {
    return this.type === 'message';
  },

  /**
   * True if this activation of the middlware chain is a closing connection
   */
  get isClosing() {
    return this.type === 'closing';
  },

  /**
   * Object representing the http(s) headers that began this connection
   */
  get requestHeaders() {
    return this[REQUEST_SYMBOL].headers;
  },

  /**
   * IP Address of the client
   */
  get ip() {
    return this[REQUEST_SYMBOL].connection.remoteAddress;
  },

  /**
   * String URL path that began the connection
   */
  get path() {
    return this[REQUEST_SYMBOL].url;
  },

  /**
   * HTTP method used to begin the connection
   */
  get method() {
    return this[REQUEST_SYMBOL].method;
  }
};

/**
 * @private
 */
module.exports = (ws, req, app) => Object.assign(Object.create(ctx), {
  app,
  type: 'connection',
  message: null,
  [SOCKET_SYMBOL]: ws,
  [REQUEST_SYMBOL]: req,
});