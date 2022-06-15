import mongoose from 'mongoose';
import { AccountType } from '@bookkeeping/common';

interface PointAttrs {
  date: Date;
  userId: string;
}

interface PointDoc extends mongoose.Document {
  date: Date;
  userId: string;
  asset: number;
  liability: number;
}

interface PointModel extends mongoose.Model<PointDoc> {
  build(attrs: PointAttrs): PointDoc;
}

const pointSchema = new mongoose.Schema(
  {
    date: {
      type: mongoose.Schema.Types.Date,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    asset: {
      type: Number,
      default: 0,
    },
    liability: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        ret.networth = parseFloat((ret.asset - ret.liability).toFixed(2));
        ret.asset = parseFloat(ret.asset.toFixed(2));
        ret.liability = parseFloat(ret.liability.toFixed(2));
      },
    },
  }
);

pointSchema.statics.build = (attrs: PointAttrs) => {
  return new Point(attrs);
};

const Point = mongoose.model<PointAttrs, PointModel>('Point', pointSchema);

export { Point };
