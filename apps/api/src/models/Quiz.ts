import mongoose, { Document, Schema } from 'mongoose';
import { QuestionType } from '@culinary/shared';

export interface IQuizQuestion {
  _id?: mongoose.Types.ObjectId;
  type: QuestionType;
  text: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface IQuiz extends Document {
  moduleId: mongoose.Types.ObjectId;
  objectiveId?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  questions: IQuizQuestion[];
  passingScore: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuizAttempt extends Document {
  quizId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  answers: number[];
  score: number;
  passed: boolean;
  completedAt: Date;
}

const QuizQuestionSchema = new Schema<IQuizQuestion>({
  type: { type: String, enum: ['multiple_choice', 'true_false'], required: true },
  text: { type: String, required: true },
  options: [{ type: String }],
  correctIndex: { type: Number, required: true },
  explanation: { type: String },
});

const QuizSchema = new Schema<IQuiz>({
  moduleId: { type: Schema.Types.ObjectId, ref: 'Module', required: true },
  objectiveId: { type: Schema.Types.ObjectId },
  title: { type: String, required: true },
  description: { type: String },
  questions: [QuizQuestionSchema],
  passingScore: { type: Number, default: 70 },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const QuizAttemptSchema = new Schema<IQuizAttempt>({
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{ type: Number }],
  score: { type: Number, required: true },
  passed: { type: Boolean, required: true },
  completedAt: { type: Date, default: Date.now },
});

export const Quiz = mongoose.model<IQuiz>('Quiz', QuizSchema);
export const QuizAttempt = mongoose.model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema);
