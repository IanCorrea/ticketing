import { Publisher, Subjects, IPaymentCreatedEvent } from '@ictickets/common';

export class PaymentCreatedPublisher extends Publisher<IPaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
