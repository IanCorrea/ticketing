import {
  Publisher,
  Subjects,
  IExpirationCompleteEvent,
} from '@ictickets/common';

export class ExpirationCompletePublisher extends Publisher<IExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
