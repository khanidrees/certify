import mongoose, { Schema, Model, PopulatedDoc } from 'mongoose';
import { IUser } from './User';

export interface ICourse {
  _id: mongoose.Types.ObjectId;
  courseName: string;
  description: string;
  organizationId: mongoose.Types.ObjectId;
  learners: PopulatedDoc<IUser & Document>[];
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema: Schema<ICourse> = new mongoose.Schema(
  {
    courseName: { type: String, required: true },
    description: { type: String, required: true },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    learners: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
);

// ── Indexes ──────────────────────────────────────────────────────────────────
// Org dashboard: GET /api/organization/dashboard — filters by organizationId
CourseSchema.index({ organizationId: 1 });

// Learner lookup: find courses a learner is enrolled in
CourseSchema.index({ learners: 1 });

export default (mongoose.models.Course as Model<ICourse>) ||
  mongoose.model<ICourse>('Course', CourseSchema);
