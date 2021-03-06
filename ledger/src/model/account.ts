import mongoose from 'mongoose';
import { AccountType } from '@bookkeeping/common';

interface AccountAttrs {
  userId: string;
  name: string;
  type: AccountType;
  close?: Date;
  mutable?: boolean;
}

interface AccountModel extends mongoose.Model<AccountDoc> {
  build(attrs: AccountAttrs): AccountDoc;
}

interface AccountDoc extends mongoose.Document {
  userId: string;
  name: string;
  type: AccountType;
  close: Date;
  mutable: boolean;
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
    close: {
      type: mongoose.Schema.Types.Date,
    },
    mutable: {
      type: Boolean,
      default: true,
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

accountSchema.statics.build = (attrs: AccountAttrs) => {
  return new Account(attrs);
};

const Account = mongoose.model<AccountAttrs, AccountModel>(
  'Account',
  accountSchema
);

export { Account, AccountType };
