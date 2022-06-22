import { Message } from 'node-nats-streaming';
import { Subjects, Listener, UserSignupEvent } from '@bookkeeping/common';
import { queueGroupName } from './queue-group-name';
import { Budget } from '../../models/budget';

export class UserSignupListener extends Listener<UserSignupEvent> {
  readonly subject = Subjects.UserSignup;
  queueGroupName = queueGroupName;

  async onMessage(data: UserSignupEvent['data'], msg: Message) {
    const userId = data.id;

    const budget = Budget.build({
      userId: data.id,
      name: 'Default',
      monthly: 10000,
      quarterly: 30000,
      semiannual: 60000,
      annual: 120000,
    });
    await budget.save();
    msg.ack();
  }
}
