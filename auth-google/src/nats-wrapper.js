const nats = require('node-nats-streaming');

class NatsWrapper {
  _client;

  // Use a typescript getter to expose client
  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting!');
    }
    return this._client;
  }

  async connect(clusterId, clientId, url) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise((resolve, reject) => {
      // note: use getter instead of direct access
      this.client.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });
      this.client.on('error', (err) => {
        reject(err);
      });
    });
  }
}

const natsWrapper = new NatsWrapper();
module.exports = { natsWrapper };
