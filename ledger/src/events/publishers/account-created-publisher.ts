import { Subjects, Publisher, AccountCreatedEvent } from '@bookkeeping/common';

export class AccountCreatedPublisher extends Publisher<AccountCreatedEvent> {
  readonly subject = Subjects.AccountCreated;
}
