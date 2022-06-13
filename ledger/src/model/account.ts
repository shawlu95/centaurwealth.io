import mongoose from 'mongoose';
import { AssetClass } from '@bookkeeping/common';

interface AccountAttrs {
  userId: string;
  name: string;
  class: AssetClass;
}

interface AccountModel extends mongoose.Model<AccountDoc> {
  build(attrs: AccountAttrs): AccountDoc;
}

interface AccountDoc extends mongoose.Document {
  userId: string;
  name: string;
  class: AssetClass;
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
    class: {
      type: String,
      required: true,
      enum: Object.values(AssetClass),
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

export { Account };
