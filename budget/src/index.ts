import mongoose from 'mongoose';
import { app } from './app';
import { UserSignupListener } from './events/listeners/user-signup-listener';
import { TransactionCreatedListener } from './events/listeners/transaction-created-listener';
import { TransactionUpdatedListener } from './events/listeners/transaction-updated-listener';
import { TransactionDeletedListener } from './events/listeners/transaction-deleted-listener';

import { natsWrapper } from './nats-wrapper';

const start = async () => {
  if (!process.env.jwt) {
    throw new Error('JWT key is undefined');
  }

  if (!process.env.MONGO_PASS) {
    throw new Error('MONGO_PASS is undefined');
  }

  if (!process.env.MONGO_DB) {
    throw new Error('MONGO_DB is undefined');
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID is undefined');
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID is undefined');
  }

  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL is undefined');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new UserSignupListener(natsWrapper.client).listen();
    new TransactionCreatedListener(natsWrapper.client).listen();
    new TransactionUpdatedListener(natsWrapper.client).listen();
    new TransactionDeletedListener(natsWrapper.client).listen();

    await mongoose.connect(
      `mongodb+srv://root:${process.env.MONGO_PASS}@` +
        `centaur.5xb07.mongodb.net/${process.env.MONGO_DB}?` +
        'retryWrites=true&w=majority'
    );
    console.log('connected to mongodb');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('listening on port 3000');
  });
};

start();
