import { Listener,  Subjects, IOrderCreatedEvent } from '@ictickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './QueueGroupName';
import { Order } from '@models/Order';

export class OrderCreatedListener extends Listener<IOrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: IOrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version
    })

    await order.save();

    msg.ack();
  }
}
