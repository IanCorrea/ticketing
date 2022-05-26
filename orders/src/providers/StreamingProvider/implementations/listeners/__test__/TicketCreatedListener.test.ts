import mongoose from 'mongoose';
import { ITicketCreatedEvent } from '@ictickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '@models/Ticket';
import NatsProvider from '../../NatsProvider';
import { TicketCreatedListener } from '../TicketCreatedListener';

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(NatsProvider.client);
  // create a fake data event
  const data: ITicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a ticket was created!
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assetions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
