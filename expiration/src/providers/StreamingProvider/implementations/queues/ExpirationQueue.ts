import Bull, { Job } from 'bull';
import redisConfig from '@config/redis';
import { ExpirationCompletePublisher } from '@providers/StreamingProvider/implementations/publishers/ExpirationCompletePublisher';
import NatsProvider from '@providers/StreamingProvider/implementations/NatsProvider';

interface Payload {
  orderId: string;
}
const expirationQueue = new Bull<Payload>('order:expiration', {
  redis: {
    host: redisConfig.redis.host,
  },
});

expirationQueue.process(async (job: Job) => {
  new ExpirationCompletePublisher(NatsProvider.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
