import mongoose, { Document, Schema } from 'mongoose';

export interface ILessonCompletion extends Document {
  userId: mongoose.Types.ObjectId;
  lessonId: mongoose.Types.ObjectId;
  moduleId: mongoose.Types.ObjectId;
  completedAt: Date;
}

const LessonCompletionSchema = new Schema<ILessonCompletion>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
  moduleId: { type: Schema.Types.ObjectId, ref: 'Module', required: true },
  completedAt: { type: Date, default: Date.now },
});

LessonCompletionSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

export const LessonCompletion = mongoose.model<ILessonCompletion>('LessonCompletion', LessonCompletionSchema);
