import { Message } from 'node-nats-streaming';
import { Subjects, Listener, ITicketUpdatedEvent } from '@ictickets/common';
import { Ticket } from '@models/Ticket';
import { queueGroupName } from './QueueGroupName';

export class TicketUpdatedListener extends Listener<ITicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;

  queueGroupName = queueGroupName;

  async onMessage(data: ITicketUpdatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
