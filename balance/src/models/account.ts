import mongoose from 'mongoose';
import { AccountType } from '@bookkeeping/common';

interface AccountAttrs {
  id: string; // required to replicate object
  userId: string;
  name: string;
  type: AccountType;
}

interface AccountSummary {
  _id?: AccountType;
  type: AccountType;
  debit: number;
  credit: number;
}

interface AccountModel extends mongoose.Model<AccountDoc> {
  build(attrs: AccountAttrs): AccountDoc;
  summary(userId: string): Promise<AccountSummary[]>;
}

interface AccountDoc extends mongoose.Document {
  userId: string;
  name: string;
  type: AccountType;
  debit: number;
  credit: number;
}

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: Object.values(AccountType),
    },
    debit: {
      type: Number,
      default: 0,
    },
    credit: {
      type: Number,
      default: 0,
    },
    balance: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;

        ret.credit = parseFloat(ret.credit.toFixed(2));
        ret.debit = parseFloat(ret.debit.toFixed(2));
      },
    },
  }
);

accountSchema.pre('save', async function (this: AccountDoc, done) {
  if (this.isModified('credit') || this.isModified('debit')) {
    const delta = parseFloat((this.debit - this.credit).toFixed(2));
    if (this.type == AccountType.Asset) {
      this.set('balance', delta);
    } else {
      this.set('balance', -delta);
    }
  }
  done();
});

accountSchema.statics.build = (attrs: AccountAttrs) => {
  return new Account({
    _id: attrs.id,
    ...attrs,
  });
};

accountSchema.statics.summary = async function (userId: string) {
  const summary = await this.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: '$type',
        credit: { $sum: '$credit' },
        debit: { $sum: '$debit' },
        count: { $sum: 1 },
      },
    },
    { $set: { type: '$_id' } },
    { $unset: '_id' },
    { $sort: { type: 1 } },
  ]);

  for (var i in summary) {
    const item = summary[i];
    const delta = parseFloat((item.debit - item.credit).toFixed(2));
    if (item.type === AccountType.Asset) {
      item.balance = delta;
    } else {
      item.balance = -delta;
    }
  }
  return summary;
};

const Account = mongoose.model<AccountAttrs, AccountModel>(
  'Account',
  accountSchema
);

export { Account, AccountType };
