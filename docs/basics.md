# HexNut Docs - Basics

<a href="index.md">Back to main docs page</a>

## Installing HexNut

```bash
npm i hexnut
```

## Creating a server

```javascript
const HexNut = require('hexnut');
const app = new HexNut({ port: 8080 });

// This server will never do anything, but the logic code would go here

app.start();
```

## Using middleware

To illustrate basic middleware usage, the `hexnut-handle` package will be used

```javascript
const HexNut = require('hexnut');
const handle = require('hexnut-handle');
const app = new HexNut({ port: 8080 });

app.use(handle.connect(ctx => {
  ctx.send('Connected!');
  ctx.state = {
    messagesReceived: 0
  };
}));

app.use(handle.matchMessage(msg => msg === 'A', ctx => {
  ctx.state.messagesReceived += 1;
  ctx.send(`It was an 'A' message. Received ${ctx.state.messagesReceived} messages.`);
}));

app.use(handle.matchMessage(msg => msg === 'B', ctx => {
  ctx.state.messagesReceived += 1;
  ctx.send(`It was an 'B' message. Received ${ctx.state.messagesReceived} messages.`);
}));

app.use(handle.message(ctx => {
  ctx.state.messagesReceived += 1;
  ctx.send(`Any other kind of message will go here. Received ${ctx.state.messagesReceived} messages.`);
}));

app.start();
```

<a href="index.md">Back to main docs page</a>