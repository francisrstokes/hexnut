# Guarding middleware: Authentication and Permissions


Just like in a REST app, it's common want to mark some of your middleware as requiring authentication, permissions, or some other kind of condition.

## Protecting middleware until a token is provided and validated

In this app, JSON is used to transfer data between client and server. If the app receives message in the format

```
{ "type": "auth", "token": "556da09a7c06c41a0c107bd6218d509b" }
```

it should validate the token, and record the user as being logged in. In reality, a more robust token mechanism - with features like revocation, expiry time, refresh mechanism etc - should be employed on a production app.

```javascript
const Hexnut = require('hexnut');
const handle = require('hexnut-handle');
const bodyparser = require('hexnut-bodyparser');
const db = require('./some-db-layer');

const app = new Hexnut({ port: 8080 });

// Automatically parse json messages
app.use(bodyparser.json());

// This middleware checks for incoming auth messages. When it gets one, it checks
// the token with the database layer. If it's valid, this state and the user are
// associated with the ctx object. If not, an error message is sent, and any
// previously associated token information is removed from ctx.
app.use(async (ctx, next) => {
  if (ctx.isMessage() && ctx.message.type && ctx.message.type === 'auth') {
    // Communicate with the database layer and validate the token
    const {isValid, user} = await db.checkToken(ctx.message.token);
    if (isValid) {
      ctx.user = user;
      ctx.hasValidToken = true;
    } else {
      ctx.hasValidToken = false;
      ctx.user = null;
      ctx.send(JSON.stringify({ type: 'error', message: 'bad token' }));
    }
  } else {
    return next();
  }
});

// The protected middleware wraps a user provided middlware.
// When it runs, it only allows the the user provided middleware to run
// if the context has already validated a token.
const protected = mw => (ctx, next) => {
  if (ctx.hasValidToken) {
    return mw(ctx, next);
  } else {
    ctx.send(JSON.stringify({ type: 'error', message: 'unauthorized' }));
  }
};

const sensitiveMessageHandler = protected(handle.matchMessage(
  msg => msg.type === 'secret stuff',
  ctx => {
    console.log(ctx.message.secrets);
  }
));

app.use(sensitiveMessageHandler);

app.start();
```

## Protecting middleware unless a user has permission

In the example above, middleware can be protected - only running when the user has been properly validated. Protecting middleware based on user roles/permissions is a very similar idea.

```javascript

// After a user has been validated, the user object and hasValidToken properties are added
// to ctx. Assuming that the user object has a list of string permissions on it, we can build
// an application specific middleware for protecting based on permissions.

const permit = (requiredPermissions, mw) => (ctx, next) => {
  const hasAllPermissions = requiredPermissions.every(perm => ctx.user.permissions.includes(perm));
  if (hasAllPermissions) {
    return mw(ctx, next);
  } else {
    ctx.send(JSON.stringify({ type: 'error', message: 'not permitted' }));
  }
};

// Using the permit middleware is as simple as:
app.use(permit(['manager', 'district coach'], ctx => {
  console.log('This user was allowed');
}));

```