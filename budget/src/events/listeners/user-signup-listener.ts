import { Message } from 'node-nats-streaming';
import { Subjects, Listener, UserSignupEvent } from '@bookkeeping/common';
import { queueGroupName } from './queue-group-name';
import { Budget } from '../../models/budget';

export class UserSignupListener extends Listener<UserSignupEvent> {
  readonly subject = Subjects.UserSignup;
  queueGroupName = queueGroupName;

  async onMessage(data: UserSignupEvent['data'], msg: Message) {
    const budget = Budget.build({
      userId: data.id,
      name: 'Default',
      monthly: 10000,
      mutable: false,
    });
    await budget.save();
    msg.ack();
  }
}
