import { IOrderCreatedEvent, OrderStatus } from '@ictickets/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '@models/Order';
import { OrderCreatedListener } from '../OrderCreatedListener';
import NatsProvider from '../../NatsProvider';

const setup = async () => {
  const listener = new OrderCreatedListener(NatsProvider.client);

  const data: IOrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'userId',
    expiresAt: 'expiresAt',
    ticket: {
      id: 'asd',
      price: 10,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('replicates the order info', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
