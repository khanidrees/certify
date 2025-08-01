import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export type UserRole = 'admin' | 'organization' | 'learner';

export interface IUser extends Document <Types.ObjectId>{
  _id: Types.ObjectId;
  username: string;
  password: string;
  role: UserRole;
  organizationName?: string; // Optional field for organization name
  learnerName?: string; // Optional field for learner name
  isApproved: boolean; // Field to track approval status for organization users
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  organizationName: { type: String, }, // Optional field for organization name
  learnerName: { type: String, }, // Optional field for learner name
  role: { type: String, enum: ['admin', 'organization', 'learner'], required: true },
  isApproved: { type: Boolean, default: false }, // Field to track approval status For organization users
},{
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

export default (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);