import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  IExpirationCompleteEvent,
  OrderStatus,
} from '@ictickets/common';
import { Order } from '@models/Order';
import { queueGroupName } from './QueueGroupName';
import { OrderCancelledPublisher } from '../publishers/OrderCancelledPublisher';

export class ExpirationCompleteListener extends Listener<IExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;

  queueGroupName = queueGroupName;

  async onMessage(data: IExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}
