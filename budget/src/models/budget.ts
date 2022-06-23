import mongoose from 'mongoose';

interface BudgetAttrs {
  userId: string;
  name: string;
  monthly: number;
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
  },
  {
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret._id;
      },
    },
    toObject: { virtuals: true },
  }
);

budgetSchema.statics.build = (attrs: BudgetAttrs) => {
  return new Budget(attrs);
};

budgetSchema.virtual('quarterly').get(function () {
  return this.monthly! * 3;
});

budgetSchema.virtual('annual').get(function () {
  return this.monthly! * 12;
});

const Budget = mongoose.model<BudgetAttrs, BudgetModel>('Budget', budgetSchema);

export { Budget, BudgetDoc };
