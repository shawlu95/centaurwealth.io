import { Subjects, Publisher, AccountClosedEvent } from '@bookkeeping/common';

export class AccountClosedPublisher extends Publisher<AccountClosedEvent> {
  readonly subject = Subjects.AccountClosed;
}
