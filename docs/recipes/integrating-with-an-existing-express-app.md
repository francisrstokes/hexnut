# Integrating with an existing express app

A hexnut app can share the same underlying server as an express app, and thus easily incorporated into an existing backend.

```javascript
const Hexnut = require('hexnut');
const handle = require('hexnut-handle');
const cors = require('cors');
const expressApp = require('App')();
const http = require('http');
const https = require('https');


// Add express middle to the express app
expressApp.use(cors());

// Configure http/https server for express
let withSSL = true;
const server = withSSL
  ? new https.createServer({ cert, key }, expressApp)
  : new http.createServer(expressApp);

// Create a hexnut app using the server
const app = new Hexnut({ port: 8080, server });

// Add hexnut middleware to hexnut app
app.use(handle.message(ctx => {
  ctx.send(`You sent: ${ctx.message}`);
}));

// Start the app
app.start();
```