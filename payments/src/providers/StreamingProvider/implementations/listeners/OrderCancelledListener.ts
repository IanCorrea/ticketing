import {
  Listener,
  IOrderCancelledEvent,
  Subjects,
  OrderStatus,
} from '@ictickets/common';
import { Order } from '@models/Order';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './QueueGroupName';

export class OrderCancelledListener extends Listener<IOrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;

  queueGroupName = queueGroupName;

  async onMessage(data: IOrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}
