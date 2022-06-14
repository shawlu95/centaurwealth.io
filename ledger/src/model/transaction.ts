import mongoose from 'mongoose';
import {
  Entry,
  AccountType,
  BadRequestError,
  EntryType,
  NotAuthorizedError,
  NotFoundError,
} from '@bookkeeping/common';
import { Account } from './account';

interface TransactionAttrs {
  userId: string;
  memo: string;
  entries: Entry[];
}

interface TransactionModel extends mongoose.Model<TransactionDoc> {
  build(attrs: TransactionAttrs): TransactionDoc;
}

interface TransactionDoc extends mongoose.Document {
  userId: string;
  memo: string;
  entries: Entry[];
}

const entrySchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: Object.values(EntryType),
  },
  accountId: {
    type: String,
    required: true,
  },
  accountName: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    required: true,
    enum: Object.values(AccountType),
  },
});

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    memo: {
      type: String,
      required: true,
    },
    entries: {
      type: [entrySchema],
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

transactionSchema.pre('save', async function (done) {
  if (this.isModified('entries')) {
    var debit = 0;
    var credit = 0;
    for (var i in this.entries) {
      const entry: Entry = this.entries[i];
      const account = await Account.findById(entry.accountId);

      if (!account) {
        throw new NotFoundError();
      }

      if (account.userId != this.userId) {
        throw new NotAuthorizedError();
      }

      if (entry.type === EntryType.Debit) {
        debit += entry.amount;
      }

      if (entry.type === EntryType.Credit) {
        credit += entry.amount;
      }
    }

    if (debit != credit) {
      throw new BadRequestError('Debit must equal to credit');
    }
  }
  done();
});

transactionSchema.statics.build = (attrs: TransactionAttrs) => {
  return new Transaction(attrs);
};

const Transaction = mongoose.model<TransactionAttrs, TransactionModel>(
  'Transaction',
  transactionSchema
);

export { Transaction };
