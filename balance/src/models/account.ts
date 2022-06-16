import mongoose from 'mongoose';
import { AccountType } from '@bookkeeping/common';

interface AccountAttrs {
  id: string; // required to replicate object
  userId: string;
  name: string;
  type: AccountType;
}

interface AccountModel extends mongoose.Model<AccountDoc> {
  build(attrs: AccountAttrs): AccountDoc;
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
      },
    },
  }
);

accountSchema.statics.build = (attrs: AccountAttrs) => {
  return new Account({
    _id: attrs.id,
    ...attrs,
  });
};

const Account = mongoose.model<AccountAttrs, AccountModel>(
  'Account',
  accountSchema
);

export { Account, AccountType };
