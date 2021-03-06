# HexNut Docs - API

## HexNut Server
HexNut server instance

**Kind**: global class  

* [HexNut](#HexNut)
    * [new HexNut(wsConfig)](#new_HexNut_new)
    * [.use(middleware)](#HexNut+use)
    * [.start()](#HexNut+start)

<a name="new_HexNut_new"></a>

### new HexNut(wsConfig)
Create a new HexNut instance


| Param | Type | Description |
| --- | --- | --- |
| wsConfig | <code>object</code> | Config object, mixed with defaults, passed to Websocket.Server constructor |

#### Primary useful options for wsConfig

* **port**: The port number of the server
* **server**: A [http](https://nodejs.org/api/http.html)/[https](https://nodejs.org/api/https.html) node server instance. If passed, the websocket will use this server to accept connections. This option allows for interop with other frameworks like koa and express.

<a name="HexNut+use"></a>

### app.use(middleware)
Adds a middleware function to the HexNut instance

**Kind**: instance method of [<code>HexNut</code>](#HexNut)  

| Param | Type |
| --- | --- |
| middleware | [<code>middleware</code>](#middleware) | 

<a name="HexNut+start"></a>

### app.start()
Start the HexNut Websocket Server

**Kind**: instance method of [<code>HexNut</code>](#HexNut)  

### app.stop()
Stop the HexNut Websocket Server

**Kind**: instance method of [<code>HexNut</code>](#HexNut)  

<a name="middleware"></a>

## middleware : <code>function</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>ctx</code> | Context object for the connection |
| next | <code>NextMiddlewareFn</code> | Callback function that triggers the next middleware |

<a name="ctx"></a>

## ctx
Context object representing a HexNut connection

**Kind**: global class  

- [HexNut Docs - API](#hexnut-docs---api)
  - [HexNut Server](#hexnut-server)
    - [new HexNut(wsConfig)](#new-hexnutwsconfig)
    - [app.use(middleware)](#appusemiddleware)
    - [app.start()](#appstart)
    - [app.stop()](#appstop)
  - [middleware : <code>function</code>](#middleware--codefunctioncode)
  - [ctx](#ctx)
    - [ctx.message](#ctxmessage)
    - [ctx.isConnection](#ctxisconnection)
    - [ctx.isMessage](#ctxismessage)
    - [ctx.isClosing](#ctxisclosing)
    - [ctx.requestHeaders](#ctxrequestheaders)
    - [ctx.ip](#ctxip)
    - [ctx.path](#ctxpath)
    - [ctx.method](#ctxmethod)
    - [ctx.send(data)](#ctxsenddata)
    - [ctx.sendToAll(data)](#ctxsendtoalldata)
    - [ctx.done()](#ctxdone)
    - [ctx.throw(err)](#ctxthrowerr)
    - [ctx.app](#ctxapp)

<a name="ctx.isConnection"></a>

### ctx.message
The message recieved. Equal to `null` if `ctx.isConnection === true`

### ctx.isConnection
True if this activation of the middlware chain is a new connection

<a name="ctx.isMessage"></a>

### ctx.isMessage
True if this activation of the middlware chain is a new message

<a name="ctx.isMessage"></a>

### ctx.isClosing
True if this activation of the middlware chain is a connection closing

<a name="ctx.requestHeaders"></a>

### ctx.requestHeaders
Object representing the http(s) headers that began this connection

<a name="ctx.ip"></a>

### ctx.ip
IP Address of the client

<a name="ctx.path"></a>

### ctx.path
String URL path that began the connection

<a name="ctx.method"></a>

### ctx.method
HTTP method used to begin the connection

<a name="ctx.send"></a>

### ctx.send(data)
Send a message to the client


| Param | Type |
| --- | --- |
| data | <code>\*</code> | 

<a name="ctx.sendToAll"></a>

### ctx.sendToAll(data)
Send a message to all connected clients


| Param | Type |
| --- | --- |
| data | <code>\*</code> | 

<a name="ctx.done"></a>

### ctx.done()
Short circuit all remaining middleware

<a name="ctx.throw"></a>

### ctx.throw(err)
Throw an error

| Param | Type |
| --- | --- |
| err | <code>Error</code> | 

### ctx.app
Reference to the HexNut app.