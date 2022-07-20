const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
    auth: {
      type: String,
      required: true,
      default: 'google',
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

const User = mongoose.model('User', userSchema);

module.exports = { User };
