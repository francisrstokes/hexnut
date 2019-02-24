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
  - [middleware : <code>function</code>](#middleware--codefunctioncode)
  - [ctx](#ctx)
    - [ctx.isConnection](#ctxisconnection)
    - [ctx.isMessage](#ctxismessage)
    - [ctx.requestHeaders](#ctxrequestheaders)
    - [ctx.ip](#ctxip)
    - [ctx.path](#ctxpath)
    - [ctx.method](#ctxmethod)
    - [ctx.send(data)](#ctxsenddata)
    - [ctx.sendToAll(data)](#ctxsendtoalldata)
    - [ctx.done()](#ctxdone)
    - [ctx.throw(err)](#ctxthrowerr)

<a name="ctx.isConnection"></a>

### ctx.isConnection
True if this activation of the middlware chain is a new connection

**Kind**: static property of [<code>ctx</code>](#ctx)  
<a name="ctx.isMessage"></a>

### ctx.isMessage
True if this activation of the middlware chain is a new message

**Kind**: static property of [<code>ctx</code>](#ctx)  
<a name="ctx.requestHeaders"></a>

### ctx.requestHeaders
Object representing the http(s) headers that began this connection

**Kind**: static property of [<code>ctx</code>](#ctx)  
<a name="ctx.ip"></a>

### ctx.ip
IP Address of the client

**Kind**: static property of [<code>ctx</code>](#ctx)  
<a name="ctx.path"></a>

### ctx.path
String URL path that began the connection

**Kind**: static property of [<code>ctx</code>](#ctx)  
<a name="ctx.method"></a>

### ctx.method
HTTP method used to begin the connection

**Kind**: static property of [<code>ctx</code>](#ctx)  
<a name="ctx.send"></a>

### ctx.send(data)
Send a message to the client

**Kind**: static method of [<code>ctx</code>](#ctx)  

| Param | Type |
| --- | --- |
| data | <code>\*</code> | 

<a name="ctx.sendToAll"></a>

### ctx.sendToAll(data)
Send a message to all connected clients

**Kind**: static method of [<code>ctx</code>](#ctx)  

| Param | Type |
| --- | --- |
| data | <code>\*</code> | 

<a name="ctx.done"></a>

### ctx.done()
Short circuit all remaining middleware

**Kind**: static method of [<code>ctx</code>](#ctx)  
<a name="ctx.throw"></a>

### ctx.throw(err)
Throw an error

**Kind**: static method of [<code>ctx</code>](#ctx)  

| Param | Type |
| --- | --- |
| err | <code>Error</code> | 

