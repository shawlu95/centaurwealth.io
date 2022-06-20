import mongoose from 'mongoose';
import { mongoosePagination, Pagination } from 'mongoose-paginate-ts';
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
  date: Date;
  entries: Entry[];
}

interface TransactionModel extends mongoose.Model<TransactionDoc> {
  build(attrs: TransactionAttrs): TransactionDoc;
}

interface TransactionDoc extends mongoose.Document {
  userId: string;
  memo: string;
  date: Date;
  entries: Entry[];
  amount: number;
  debit: number;
  credit: number;
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
    date: {
      type: mongoose.Schema.Types.Date,
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    entries: {
      type: [entrySchema],
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret: TransactionDoc) {
        // for full transaction, credit == debit == amount
        // if accountId is provided, filter in route handler
        ret.credit = ret.amount;
        ret.debit = ret.amount;
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

transactionSchema.pre('save', async function (this: TransactionDoc, done) {
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
    this.set('amount', debit);
  }
  done();
});

transactionSchema.plugin(mongoosePagination);

transactionSchema.statics.build = (attrs: TransactionAttrs) => {
  return new Transaction(attrs);
};

const Transaction: Pagination<TransactionDoc> = mongoose.model<
  TransactionAttrs,
  Pagination<TransactionDoc>
>('Transaction', transactionSchema);

export { Transaction };
