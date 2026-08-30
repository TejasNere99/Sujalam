import mongoose, { Schema, Document } from 'mongoose';

export interface IWhatsAppUser extends Document {
  phone_number: string;
  user_id: mongoose.Types.ObjectId | null;
  farm_id: mongoose.Types.ObjectId | null;
  language: string;
  onboarding_state: string;
  created_at: Date;
  updated_at: Date;
}

const WhatsAppUserSchema: Schema = new Schema({
  phone_number: { type: String, required: true, unique: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  farm_id: { type: Schema.Types.ObjectId, ref: 'Farm', default: null },
  language: { type: String, default: 'en' },
  onboarding_state: { type: String, default: 'INIT' },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export const WhatsAppUser = mongoose.model<IWhatsAppUser>('WhatsAppUser', WhatsAppUserSchema);
