import { Publisher, Subjects, ITicketCreatedEvent } from '@ictickets/common';

export class TicketCreatedPublisher extends Publisher<ITicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
