import bcrypt from 'bcryptjs';
import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    cpf: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password_hash: {
      type: String,
      required: true,
    },
    avatar: {
      type: Schema.Types.ObjectId,
      ref: 'File',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function (next) {
  this.password_hash = await bcrypt.hash(this.password_hash, 8);

  next();
});

export default model('User', UserSchema);
