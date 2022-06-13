import mongoose from 'mongoose';
import { Password } from '../services/password';

// Describe the properties required to create new user
interface UserAttrs {
  email: string;
  password: string;
}

// Describe property (static method) of user model
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// Describe property of a User document
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
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

// With old fashion function, we have access to the actual user being saved
// Arrow function would lose the context!
userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    // only hash when modified, do not rehash a hashed password
    // isModified will return true when first created
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// Type of constructor: <T extends Document, U extends Model<T>>
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
