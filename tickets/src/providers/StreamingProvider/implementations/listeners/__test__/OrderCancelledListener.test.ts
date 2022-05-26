import { IOrderCancelledEvent } from '@ictickets/common';
import { Ticket } from '@models/Ticket';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCancelledListener } from '../OrderCancelledListener';
import NatsProvider from '../../NatsProvider';

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCancelledListener(NatsProvider.client);

  // Create and save a ticket
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: 'userId',
  });
  ticket.set({ orderId });
  await ticket.save();

  // Create the fake data event
  const data: IOrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it('updates the ticket, publishes an event, and acks the message', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(NatsProvider.client.publish).toHaveBeenCalled();
});
