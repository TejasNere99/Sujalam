import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email?: string;
  phone?: string;
  password_hash: string;
  language?: string;
  created_at: Date;
  updated_at: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String },
  password_hash: { type: String, required: true },
  language: { type: String, default: 'en' },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export const User = mongoose.model<IUser>('User', UserSchema);
