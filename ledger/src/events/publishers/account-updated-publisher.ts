import { Subjects, Publisher, AccountUpdatedEvent } from '@bookkeeping/common';

export class AccountUpdatedPublisher extends Publisher<AccountUpdatedEvent> {
  readonly subject = Subjects.AccountUpdated;
}
