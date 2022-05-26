import 'dotenv/config';
import mongoose from 'mongoose';
import mongoConfig from '@config/mongo';
import natsConfig from '@config/nats';
import NatsProvider from '@providers/StreamingProvider/implementations/NatsProvider';
import { OrderCreatedListener } from '@providers/StreamingProvider/implementations/listeners/OrderCreatedListener';
import { OrderCancelledListener } from '@providers/StreamingProvider/implementations/listeners/OrderCancelledListener';
import app from './app';

const start = async () => {
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
    new OrderCancelledListener(NatsProvider.client).listen();

    await mongoose.connect(mongoConfig.mongo.uri);
    console.log(`Connected to MongoDb: ${mongoConfig.mongo.uri}`);
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!');
  });
};

start();
