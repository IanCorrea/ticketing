import { Message } from 'node-nats-streaming';
import { Subjects, Listener, ITicketCreatedEvent } from '@ictickets/common';
import { Ticket } from '@models/Ticket';
import { queueGroupName } from './QueueGroupName';

export class TicketCreatedListener extends Listener<ITicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: ITicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;
    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();

    msg.ack();
  }
}
