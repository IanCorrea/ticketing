import { Listener, IOrderCreatedEvent, Subjects } from '@ictickets/common';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '@providers/StreamingProvider/implementations/queues/ExpirationQueue';
import { queueGroupName } from './QueueGroupName';

export class OrderCreatedListener extends Listener<IOrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: IOrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log('Waiting this many milliseconds to process the job:', delay);

    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      },
    );

    msg.ack();
  }
}
