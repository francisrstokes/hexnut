# HexNut Docs - Core Concepts

<a href="index.md">Back to main docs page</a>

HexNut was designed to be instantly usable by anyone who was familiar with existing node web frameworks like koa and express.

There are 2 core concepts at work in HexNut, and both are fairly simple:

- <a href="#the-ctx-object">client websocket connection are abstracted into a `ctx` object, which lasts for the lifetime of the connection</a>
- <a href="#middleware">a _middleware_ chain is used to process the ctx object, and add functionality to HexNut</a>

The main _difference_ between HexNut and web frameworks like koa and express is that web socket connections are **persistent** and **stateful**. Every _http request_ that comes into a web framework is standalone - it carries no state and is not intrinsically related to any connections that came in before or after. The moment the request is finalised, the objects associated with that request (`ctx` in koa, `req/res` in express) cease to exist. Now, contrasting to that, every _message_ that comes through a websocket is intrinsically tied to the connection as a whole, so in HexNut, the same `ctx` is passed to every message associcated with a particular client, and is only destroyed when the connection itself is destroyed.

## The ctx object

(To see the full docs for the `ctx` object, <a href="api.md">check out the API documentation</a>)

The `ctx` object is created when a connection is received, and lasts for the lifetime of the connection.

- You can send messages to the client using `ctx.send(data)`.
- You can get the data of a message using `ctx.message`.
- You can find out the the _type_ of message that was received using `ctx.isMessage`, `ctx.isConnection`, or `ctx.isClosing`, since middleware functions fire on new connections, when a message is received, and when the connection is closing.

An important note is that any middleware you write can add properties/functions to the `ctx` object, and they will be accessible to every middleware for lifetime of the connection. This makes writing protocols and other stateful exchanges far easier.

## Middleware

Middleware are special functions that run when a connection is established and when messages are received. Middleware functions have a signature of:

```javascript
async function myMiddleware(ctx, next) {
  // - code -
}
```

Where `ctx` is the context described above, and `next` is a function that can be used to trigger the next middleware in the chain. Middleware functions are asynchronous (they return Promises), which means you can easily use `async/await` syntax to connect with data sources or API.

Middleware should (most of the time) be thought of as a _lower level construct_, which basically means you should write or use higher level abstractions. For example, here is how you would handle a new connection and message in "pure" middleware form:

```javascript
app.use((ctx, next) => {
  if (ctx.isConnection) {
    ctx.send('Howdy partner!');
  } else {
    // It wasn't a connection, so trigger the next middleware in the chain
    return next();
  }
});


app.use((ctx, next) => {
  if (ctx.isMessage && ctx.message === 'Hello') {
    ctx.send('You said "Hello"!');
  } else {
    // It wasn't a message or the message was not correct, so trigger the next middleware in the chain
    return next();
  }
});

app.use((ctx, next) => {
  if (ctx.isMessage) {
    ctx.send('You said anything else, except "Hello"!');
  } else {
    // It wasn't a message or the message was not correct, so trigger the next middleware in the chain
    return next();
  }
});
```

Writing these `if/else` statements and returning `next()` is going to get tedious and error prone and some point, so it's better to create an abstraction. <a href="https://github.com/francisrstokes/hexnut-handle/blob/master/index.js">A very simple one exists for this very purpose</a> called `hexnut-handle`. This is how it simplfies and makes the code more readable:

```javascript
const handle = require('hexnut-handle');

app.use(handle.connect(
  ctx => ctx.send(`You said: ${ctx.message}!`)
));

app.use(handle.message(
  msg => msg === 'Hello', // Only run our handler if the message === 'Hello'
  ctx => ctx.send('You said "Hello"!')
));

app.use(handle.message(
  _ => true, // active for any message that gets here
  ctx => ctx.send('You said anything else, except "Hello"!')
));
```

Because middleware functions can be `async`, they can actually run code even after they have passed on to the next middleware by calling `next()`.

```javascript
app.use(async (ctx, next) => {
  // Record when we started running
  const startTime = Date.now();

  // Await the next middleware in the chain
  await next();

  // After the next middleware has run, we can continue to run more code
  const endTime = Date.now();

  console.log(`This middleware ran for ${endTime - startTime} milleseconds`);
});
```

<a href="index.md">Back to main docs page</a>