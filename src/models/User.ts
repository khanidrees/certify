import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export type UserRole = 'admin' | 'organization' | 'learner';

export interface IUser extends Document<Types.ObjectId> {
  _id: Types.ObjectId;
  username: string;
  password?: string;
  role: UserRole;
  organizationName?: string;
  learnerName?: string;
  isApproved: boolean;
  googleId?: string;
  authProvider?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String },
    organizationName: { type: String },
    learnerName: { type: String },
    role: {
      type: String,
      enum: ['admin', 'organization', 'learner'],
      required: true,
    },
    isApproved: { type: Boolean, default: false },
    googleId: { type: String, sparse: true }, // sparse so null values don't conflict
    authProvider: { type: String, enum: ['google'] },
    avatar: { type: String },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ──────────────────────────────────────────────────────────────────
// Admin dashboard: GET /api/admin/dashboard — filters by role = 'organization'
UserSchema.index({ role: 1, isApproved: 1 });

export default (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>('User', UserSchema);