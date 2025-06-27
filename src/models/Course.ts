import mongoose, { Document, Schema, Model} from "mongoose";

export interface ICourse extends Document {
  courseName: string;
  description: string;
  organizationId: mongoose.Types.ObjectId; // Reference to the organization
  learners: mongoose.Types.ObjectId[]; // Optional field to track learners enrolled in the course
  createdAt: Date;
  updatedAt: Date;
}
const CourseSchema: Schema<ICourse> = new mongoose.Schema(
  {
    courseName: { type: String, required: true },
    description: { type: String, required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the organization
    learners: [{ type: Schema.Types.ObjectId, ref: 'User' }], 
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);
export default (mongoose.models.Course as Model<ICourse>) || mongoose.model<ICourse>('Course', CourseSchema);