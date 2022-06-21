import mongoose from 'mongoose';

interface BudgetAttrs {
  userId: string;
  name: string;
  monthly: number;
  quarterly: number;
  semiannual: number;
  annual: number;
}

interface BudgetModel extends mongoose.Model<BudgetDoc> {
  build(attrs: BudgetAttrs): BudgetDoc;
}

interface BudgetDoc extends mongoose.Document {
  userId: string;
  name: string;
  monthly: number;
  quarterly: number;
  semiannual: number;
  annual: number;
}

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    monthly: {
      type: Number,
      default: 0,
    },
    quarterly: {
      type: String,
      required: true,
    },
    semiannual: {
      type: String,
      required: true,
    },
    annual: {
      type: String,
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

budgetSchema.statics.build = (attrs: BudgetAttrs) => {
  return new Budget(attrs);
};

budgetSchema.virtual('expenses', {
  ref: 'Expense',
  localField: '_id',
  foreignField: 'budget',
  justOne: false,
});

const Budget = mongoose.model<BudgetAttrs, BudgetModel>('Budget', budgetSchema);

export { Budget };
