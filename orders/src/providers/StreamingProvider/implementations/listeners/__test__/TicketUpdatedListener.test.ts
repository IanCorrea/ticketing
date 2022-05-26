import mongoose from 'mongoose';
import { ITicketCreatedEvent, ITicketUpdatedEvent } from '@ictickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '@models/Ticket';
import NatsProvider from '../../NatsProvider';
import { TicketUpdatedListener } from '../TicketUpdatedListener';

const setup = async () => {
  // create a listener
  const listener = new TicketUpdatedListener(NatsProvider.client);

  // create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  // create a fake data object
  const data: ITicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'new concert',
    price: 999,
    userId: 'asdasd',
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return all of this stuff
  return { msg, data, ticket, listener };
};

it('finds, updates, and saves a ticket', async () => {
  const { msg, data, ticket, listener } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a ticket was created!
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const { msg, data, listener } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assetions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
  const { msg, data, listener } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {
    //
  }

  expect(msg.ack).not.toHaveBeenCalled();
});
