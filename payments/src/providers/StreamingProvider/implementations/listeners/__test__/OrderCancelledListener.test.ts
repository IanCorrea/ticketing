import { IOrderCancelledEvent, OrderStatus } from '@ictickets/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '@models/Order';
import { OrderCancelledListener } from '../OrderCancelledListener';
import NatsProvider from '../../NatsProvider';

const setup = async () => {
  const listener = new OrderCancelledListener(NatsProvider.client);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: 'userId',
    version: 0,
  });
  await order.save();

  const data: IOrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: 'asd',
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order };
};

it('updates the status of the order', async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  const udaptedOrder = await Order.findById(order.id);

  expect(udaptedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
