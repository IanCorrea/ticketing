import { Publisher, Subjects, IOrderCreatedEvent } from '@ictickets/common';

export class OrderCreatedPublisher extends Publisher<IOrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
