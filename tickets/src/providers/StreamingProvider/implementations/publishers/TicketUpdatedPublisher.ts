import { Publisher, Subjects, ITicketUpdatedEvent } from '@ictickets/common';

export class TicketUpdatedPublisher extends Publisher<ITicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
