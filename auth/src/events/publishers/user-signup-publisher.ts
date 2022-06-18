import { Subjects, Publisher, UserSignupEvent } from '@bookkeeping/common';

export class UserSignupPublisher extends Publisher<UserSignupEvent> {
  readonly subject = Subjects.UserSignup;
}
