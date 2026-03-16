import mongoose, { Document, Schema } from 'mongoose';

export interface ILesson extends Document {
  moduleId: mongoose.Types.ObjectId;
  objectiveId?: mongoose.Types.ObjectId;
  title: string;
  content: string;
  videoUrl?: string;
  imageUrl?: string;
  order: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema = new Schema<ILesson>({
  moduleId: { type: Schema.Types.ObjectId, ref: 'Module', required: true },
  objectiveId: { type: Schema.Types.ObjectId },
  title: { type: String, required: true },
  content: { type: String, default: '' },
  videoUrl: { type: String },
  imageUrl: { type: String },
  order: { type: Number, default: 0 },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.model<ILesson>('Lesson', LessonSchema);
