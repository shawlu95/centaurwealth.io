import {
  Subjects,
  Publisher,
  TransactionCreatedEvent,
} from '@bookkeeping/common';

export class TransactionCreatedPublisher extends Publisher<TransactionCreatedEvent> {
  readonly subject = Subjects.TransactionCreated;
}
