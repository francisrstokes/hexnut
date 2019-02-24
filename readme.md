# HexNut

HexNut is a middleware based, express/koa like framework for web sockets.

[![npm version](https://badge.fury.io/js/hexnut.svg)]()
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()
[![CircleCI](https://circleci.com/gh/francisrstokes/hexnut/tree/master.svg?style=svg)](https://circleci.com/gh/francisrstokes/hexnut/tree/master)

<a href="docs/index.md">For an introduction, and API documentation, please check out the docs.</a>

## Middleware

* <a href="https://github.com/francisrstokes/hexnut-handle">hexnut-handle</a>: Basic middleware abstraction for handling connections and messages
* <a href="https://github.com/francisrstokes/hexnut-bodyparser">hexnut-bodyparser</a>: Automatically parse JSON messages
* <a href="https://github.com/francisrstokes/hexnut-sequence">hexnut-sequence</a>: Create sequenced conversations between client and server
* <a href="https://github.com/francisrstokes/hexnut-restore-connection">hexnut-restore-connection</a>: Allow the client to restore a connection state if connectivity is lost
* <a href="https://github.com/francisrstokes/hexnut-router">hexnut-router</a>: Respond differently when sockets connect and communicate on different URLs. Great for versioning!

## Client side

You can use hexnut as a client in the frontend with `hexnut-client`. It is also middleware based and can use many of the server middlewares directly, such as `hexnut-bodyparser` and `hexnut-sequence`.

## Examples

### Trivial Example

```javascript
const HexNut = require('hexnut');
const app = new HexNut({ port: 8080 });

app.use(ctx => {
  if (ctx.isConnection) {
    ctx.state = { count: 0 };
    return ctx.send('Hello, and welcome to the socket!');
  }

  ctx.state.count++;
  ctx.send(`Message No. ${ctx.state.count}: ${ctx.message}`);
});

app.start();
```

### Parsing JSON automatically

```javascript
const HexNut = require('hexnut');
const bodyParser = require('hexnut-bodyparser');
const app = new HexNut({ port: 8080 });

app.use(bodyParser.json());

app.use(ctx => {
  if (ctx.isConnection) {
    ctx.state = { count: 0 };
    return ctx.send('Hello, and welcome to the socket!');
  }

  if (ctx.message.type) {
    ctx.state.count++;
    ctx.send(`Message No. ${ctx.state.count}: ${ctx.message.type}`);
  } else {
    ctx.send(`Invalid message format, expecting JSON with a "type" key`);
  }
});

app.start();
```

### Handling messages by type

```javascript
const HexNut = require('hexnut');
const handle = require('hexnut-handle');
const app = new HexNut({ port: 8080 });

app.use(handle.connect(ctx => {
  ctx.count = 0;
}));

app.use(handle.message(
  msg => msg === 'incCount',
  ctx => ctx.count++
));

app.use(handle.message(
  msg => msg === 'decCount',
  ctx => ctx.count--
));

app.use(handle.message(
  msg => msg === 'getCount',
  ctx => ctx.send(ctx.count)
));

app.start();
```


### Sequencing Interactions

```javascript
const HexNut = require('hexnut');
const bodyParser = require('hexnut-bodyparser');
const sequence = require('hexnut-sequence');
const app = new HexNut({ port: 8080 });

app.use(bodyParser.json());

// This sequence happens when the user connects
app.use(sequence.onConnect(function* (ctx) {
  ctx.send(`Welcome, ${ctx.ip}`);
  const name = yield sequence.getMessage();
  ctx.clientName = name;
  return;
}));

app.use(sequence.interuptable(function* (ctx) {
  // In order to use this sequence, we assert that we must have a clientName on the ctx
  yield sequence.assert(() => 'clientName' in ctx);

  // We first expect a message with type == greeting
  const greeting = yield sequence.matchMessage(msg => msg.type === 'greeting');

  // Then a message that has type == timeOfDay
  const timeOfDay = yield sequence.matchMessage(msg => msg.type === 'timeOfDay');

  return ctx
    .send(`And a ${greeting.value} to you too, ${ctx.clientName} on this fine ${timeOfDay.value}`);
}));

app.start();
```