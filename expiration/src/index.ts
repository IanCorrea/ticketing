import 'dotenv/config';
import natsConfig from '@config/nats';
import NatsProvider from '@providers/StreamingProvider/implementations/NatsProvider';
import { OrderCreatedListener } from '@providers/StreamingProvider/implementations/listeners/OrderCreatedListener';

const start = async () => {
  console.log('Starting...');
  if (!natsConfig.nats.clientId) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }

  try {
    await NatsProvider.connect(
      natsConfig.nats.clusterId,
      natsConfig.nats.clientId,
      natsConfig.nats.url,
    );
    NatsProvider.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => NatsProvider.client.close());
    process.on('SIGTERM', () => NatsProvider.client.close());

    new OrderCreatedListener(NatsProvider.client).listen();
  } catch (err) {
    console.error(err);
  }
};

start();
