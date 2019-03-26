const {expect} = require('chai');
const Websocket = require('ws');
const HexNut = require('../src');
const defaultConfig = require('../src/config');

const PORT = process.env.PORT || 8181;
const serverAddress = `ws://localhost:${PORT}`;

describe('HexNut App', () => {
  it('should create a app with no config opts', () => {
    expect(() => new HexNut()).to.not.throw();
  });

  it('should create a app with empty config opts', () => {
    expect(() => new HexNut({})).to.not.throw();
  });

  it('should have the default config when no opts are passed', () => {
    expect((new HexNut()).config).to.deep.equal(defaultConfig);
    expect((new HexNut({})).config).to.not.deep.equal(defaultConfig);
  });

  it('should add middleware', () => {
    const app = new HexNut();
    expect(app.middleware.length).to.equal(0);

    app.use(() => {});
    expect(app.middleware.length).to.equal(1);
  });

  it('should start the server successfully', done => {
    const app = new HexNut();
    expect(() => {
      app.start();
      setTimeout(() => {
        app.stop();
        done();
      }, 10);
    }).to.not.throw();
  });

  it('should fail to start on bad port', done => {
    const app = new HexNut({port:-1});
    expect(() => {
      app.start();
    }).to.throw();
    done();
  });

  it('should run middleware when a connection occurs', done => {
    const app = new HexNut({port: PORT});
    app.start();

    let ran = false;
    app.use(() => ran = true);

    expect(ran).to.be.false;

    const client = new Websocket(serverAddress);

    client.on('open', ws => {
      client.send(1);
      setTimeout(() => {
        expect(ran).to.be.true;
        app.stop();
        done();
      }, 10);
    });
  });

  it('should run middleware when a connection occurs', done => {
    const app = new HexNut({port: PORT});
    app.start();

    let ran = false;
    app.use(() => ran = true);

    expect(ran).to.be.false;

    const client = new Websocket(serverAddress);

    client.on('open', () => {
      client.send(1);
      setTimeout(() => {
        expect(ran).to.be.true;
        app.stop();
        done();
      }, 10);
    });
  });

  it('should run the next middleware in the chain when next is called', done => {
    const app = new HexNut({port: PORT});
    app.start();

    let ran = false;
    app.use((_, next) => {
      ran = true;
      return next();
    });

    let ran2 = false;
    app.use(() => {
      ran2 = true;
    });

    let ran3 = false;
    app.use(() => {
      ran3 = true;
    });

    expect(ran).to.be.false;
    expect(ran2).to.be.false;
    expect(ran3).to.be.false;

    const client = new Websocket(serverAddress);

    client.on('open', ws => {
      client.send(1);
      setTimeout(() => {
        expect(ran).to.be.true;
        expect(ran2).to.be.true;
        expect(ran3).to.be.false;
        app.stop();
        done();
      }, 10);
    });
  });

  it('should middlware asyncronously', done => {
    const app = new HexNut({port: PORT});
    app.start();

    let ran = false;
    let ran3 = false;
    app.use(async (_, next) => {
      ran = true;
      await next();
      ran3 = true;
    });

    let ran2 = false;
    app.use(() => {
      ran2 = true;
      expect(ran3).to.be.false;
    });

    expect(ran).to.be.false;
    expect(ran2).to.be.false;
    expect(ran3).to.be.false;

    const client = new Websocket(serverAddress);

    client.on('open', () => {
      client.send(1);
      setTimeout(() => {
        expect(ran).to.be.true;
        expect(ran2).to.be.true;
        expect(ran3).to.be.true;
        app.stop();
        done();
      }, 10);
    });
  });

  it('should run the onerror function when errors occur', done => {
    const app = new HexNut({port: PORT});
    app.start();

    const err = new Error('yes');

    let ran = false;
    app.onerror = (e) => {
      ran = true;
      expect(e).to.be.equal(err);
    }

    app.use(() => {
      throw err;
    })

    const client = new Websocket(serverAddress);

    client.on('open', () => {
      client.send(1);
      setTimeout(() => {
        expect(ran).to.be.true;
        app.stop();
        done();
      }, 10);
    });
  });

  it('should not run the next middleware is ctx.done() is called', done => {
    const app = new HexNut({port: PORT});
    app.start();

    let ran = false;
    app.use((ctx, next) => {
      ran = true;
      ctx.done();
      return next();
    });

    let ran2 = false;
    app.use(() => {
      ran2 = true;
    });

    const client = new Websocket(serverAddress);

    client.on('open', () => {
      client.send(1);
      setTimeout(() => {
        app.stop();
        expect(ran).to.be.true;
        expect(ran2).to.be.false;
        done();
      }, 10);
    });
  });

  it('should send a message to the client', done => {
    const app = new HexNut({port: PORT});
    app.start();
    app.use(ctx => ctx.send('yes'));

    const client = new Websocket(serverAddress);

    let ran = false;
    client.on('message', () => ran = true);

    client.on('open', () => {
      setTimeout(() => {
        app.stop();
        expect(ran).to.be.true;
        done();
      }, 10);
    });
  });

  it('should send a message to all clients with sendToAll', done => {
    const app = new HexNut({port: PORT});
    app.start();
    app.use(ctx => ctx.sendToAll('yes'));

    const clients = Array.from({length: 3}, () => new Websocket(serverAddress));

    let ran = clients.map(() => false);
    clients.forEach((client, i) => client.on('message', () => ran[i] = true));

    setTimeout(() => {
      app.stop();
      expect(ran).to.deep.equal(ran.map(() => true));
      done();
    }, 10);
  });

  it('should set isClosing when a connection is closing', done => {
    const app = new HexNut({port: PORT});
    app.start();

    let wasClosing = false;
    app.use(ctx => {
      if (ctx.isClosing) {
        wasClosing = true;
      }
    });

    const client = new Websocket(serverAddress);

    client.on('open', () => {
      client.close();
      setTimeout(() => {
        app.stop();
        expect(wasClosing).to.be.true;
        done();
      }, 10);
    });
  });
});

describe('ctx', () => {
  it('should get info about the request info', done => {
    const app = new HexNut({port: PORT});
    app.start();

    const path = '/something/anything/235.whatever';

    app.use(ctx => {
      expect(ctx.requestHeaders).to.be.an('object');
      expect(ctx.ip).to.be.a('string');
      expect(ctx.path).to.equal(path);
      expect(ctx.method).to.equal('GET');

      expect(ctx.isConnection).to.be.a('boolean');
      expect(ctx.isMessage).to.be.a('boolean');
      expect(ctx.send).to.be.a('function');
      expect(ctx.sendToAll).to.be.a('function');
      expect(ctx._reset).to.be.a('function');

      expect(() => {
        ctx.throw('xyz')
      }).to.throw('xyz');
    });

    const client = new Websocket(serverAddress + path);

    client.on('open', () => {
      client.send(1);
      setTimeout(() => {
        app.stop();
        done();
      }, 10);
    });
  });
});