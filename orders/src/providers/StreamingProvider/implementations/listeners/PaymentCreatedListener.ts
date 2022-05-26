import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  IPaymentCreatedEvent,
  OrderStatus,
} from '@ictickets/common';
import { Order } from '@models/Order';
import { queueGroupName } from './QueueGroupName';

export class PaymentCreatedListener extends Listener<IPaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: IPaymentCreatedEvent['data'], msg: Message) {
    const { orderId } = data;
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({ status: OrderStatus.Complete });
    await order.save();

    msg.ack();
  }
}
