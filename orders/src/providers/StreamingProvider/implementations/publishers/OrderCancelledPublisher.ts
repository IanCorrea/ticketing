import { Publisher, Subjects, IOrderCancelledEvent } from '@ictickets/common';

export class OrderCancelledPublisher extends Publisher<IOrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
