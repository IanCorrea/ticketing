import nats, { Stan } from 'node-nats-streaming';
import INatsProvider from '../interfaces/INatsProvider';

class NatsProvider implements INatsProvider {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting.');
    }

    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise((resolve, reject) => {
      this.client.on('connect', async () => {
        console.log(`Connected to NATS:: ${url}`);
        resolve(true);
      });
      this.client.on('error', err => {
        reject(err);
      });
    });
  }
}

export default new NatsProvider();
