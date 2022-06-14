import {
  Subjects,
  Publisher,
  TransactionDeletedEvent,
} from '@bookkeeping/common';

export class TransactionDeletedPublisher extends Publisher<TransactionDeletedEvent> {
  readonly subject = Subjects.TransactionDeleted;
}
