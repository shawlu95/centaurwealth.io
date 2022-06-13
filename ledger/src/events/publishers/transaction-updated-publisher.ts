import {
  Subjects,
  Publisher,
  TransactionUpdatedEvent,
} from '@bookkeeping/common';

export class TransactionUpdatedPublisher extends Publisher<TransactionUpdatedEvent> {
  readonly subject = Subjects.TransactionUpdated;
}
