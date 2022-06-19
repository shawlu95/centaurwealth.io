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
  },
  {
    toJSON: {
      transform(doc, ret) {
        injectBalance(ret);
      },
    },
  }
);

const injectBalance = (ret: any) => {
  ret.id = ret._id;
  delete ret._id;
  const delta = parseFloat((ret.debit - ret.credit).toFixed(2));

  if (ret.type == AccountType.Asset) {
    ret.balance = delta;
  } else {
    ret.balance = -delta;
  }
  ret.credit = parseFloat(ret.credit.toFixed(2));
  ret.debit = parseFloat(ret.debit.toFixed(2));
};

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
    injectBalance(summary[i]);
  }
  return summary;
};

const Account = mongoose.model<AccountAttrs, AccountModel>(
  'Account',
  accountSchema
);

export { Account, AccountType };
