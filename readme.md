# HexNut

HexNut is a middleware based, express/koa like framework for web sockets.

## Trivial Example

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

## Parsing JSON

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

## Sequencing Interactions

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