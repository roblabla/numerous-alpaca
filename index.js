'use strict';

const pmp = require('pocket-minecraft-protocol');
const EventEmitter = require('events').EventEmitter;
const path = require('path');
const requireIndex = require('requireindex');

function createPEServer(options) {
  options = options || {};
  const peServer = new PEServer();
  peServer.connect(options);
  return peServer;
}

class PEServer extends EventEmitter {
  constructor() {
    super();
    this._server = null;
  }

  connect(options) {
    const plugins = requireIndex(path.join(__dirname, 'lib', 'plugins'));
    this._server = pmp.createServer(options);

    Object.keys(plugins)
      .filter(pluginName => plugins[pluginName].server!=undefined)
      .forEach(pluginName => plugins[pluginName].server(this, options));

    this._server.on('error', error => this.emit('error',error));
    //this._server.on('listening', () => this.emit('listening',this._server.port));
    this.emit('asap');
  }
}

module.exports = {
  createPEServer:createPEServer
};
