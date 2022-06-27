import mongoose from 'mongoose';
import { AccountType } from '@bookkeeping/common';

interface PointAttrs {
  date: Date;
  userId: string;
  asset: number;
  liability: number;
}

interface PointDoc extends mongoose.Document {
  date: Date;
  userId: string;
  asset: number;
  liability: number;
}

interface PointModel extends mongoose.Model<PointDoc> {
  build(attrs: PointAttrs): PointDoc;
  updateCurrent(attrs: PointAttrs): Promise<PointDoc>;
  updateFuture(attrs: PointAttrs): Promise<void>;
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

pointSchema.statics.updateCurrent = async (attrs: PointAttrs) => {
  const points = await Point.find({
    userId: attrs.userId,
    date: { $lte: attrs.date },
  })
    .sort({ date: -1 })
    .limit(1);

  var current;
  if (points.length == 0) {
    // first transaction for user
    current = Point.build(attrs);
  } else {
    const last = points[0];
    if (last.date.getTime() == attrs.date.getTime()) {
      // already has data point on same date, modify existing
      last.set({
        asset: last.asset + attrs.asset,
        liability: last.liability + attrs.liability,
      });
      current = last;
    } else {
      // first data point for date, increment from most recent
      current = Point.build({
        ...attrs,
        asset: last.asset + attrs.asset,
        liability: last.liability + attrs.liability,
      });
    }
  }
  await current.save();
  return current;
};

pointSchema.statics.updateFuture = async (attrs: PointAttrs) => {
  await Point.updateMany(
    {
      userId: attrs.userId,
      date: { $gt: attrs.date },
    },
    { $inc: { asset: attrs.asset, liability: attrs.liability } }
  );
};

const Point = mongoose.model<PointAttrs, PointModel>('Point', pointSchema);

export { Point };
