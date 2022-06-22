import mongoose from 'mongoose';
import { mongoosePagination, Pagination } from 'mongoose-paginate-ts';
import { BudgetDoc } from './budget';

interface ExpenseAttrs {
  id: string;
  userId: string;
  memo: string;
  date: Date;
  amount: number;
  budgetId?: string; // set manually by user
}

interface ExpenseSummary {
  budgetId: mongoose.Schema.Types.ObjectId;
  amount: number;
  recent: Date;
  count: number;
}

interface ExpenseModel extends mongoose.Model<ExpenseDoc> {
  build(attrs: ExpenseAttrs): ExpenseDoc;
  summary(userId: string): Promise<ExpenseSummary[]>;
}

interface ExpenseDoc extends mongoose.Document {
  id: string;
  userId: string;
  memo: string;
  date: Date;
  amount: number;
  budgetId: string;
  budget: BudgetDoc;
}

const expenseSchema = new mongoose.Schema(
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
    budgetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Budget',
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

expenseSchema.plugin(mongoosePagination);

expenseSchema.statics.build = (attrs: ExpenseAttrs) => {
  return new Expense({
    _id: attrs.id,
    ...attrs,
  });
};

expenseSchema.statics.summary = async function (
  userId: string,
  gte: Date,
  lt: Date
) {
  const summary = await this.aggregate([
    { $match: { userId, date: { $gte: gte, $lt: lt } } },
    {
      $group: {
        _id: '$budgetId',
        amount: { $sum: '$amount' },
        newest: { $max: '$date' },
        oldest: { $min: '$date' },
        count: { $sum: 1 },
      },
    },
    { $set: { budgetId: '$_id' } },
    { $unset: '_id' },
  ]);

  return summary;
};

const Expense: Pagination<ExpenseDoc> = mongoose.model<
  ExpenseAttrs,
  Pagination<ExpenseDoc>
>('Expense', expenseSchema);

export { Expense, ExpenseSummary };
