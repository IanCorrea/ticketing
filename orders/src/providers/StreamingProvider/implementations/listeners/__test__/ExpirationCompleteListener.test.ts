import mongoose from 'mongoose';
import { IExpirationCompleteEvent, OrderStatus } from '@ictickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '@models/Ticket';
import { Order } from '@models/Order';
import NatsProvider from '../../NatsProvider';
import { ExpirationCompleteListener } from '../ExpirationCompleteListener';

const setup = async () => {
  const listener = new ExpirationCompleteListener(NatsProvider.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'userId',
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  const data: IExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, ticket, data, msg };
};

it('updates the order status to cancelled', async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emit ant OrderCancelled event', async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(NatsProvider.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (NatsProvider.client.publish as jest.Mock).mock.calls[0][1],
  );

  expect(eventData.id).toEqual(order.id);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
