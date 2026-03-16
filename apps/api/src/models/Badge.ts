import mongoose, { Document, Schema } from 'mongoose';
import { BadgeTrigger } from '@culinary/shared';

export interface IBadge extends Document {
  slug: string;
  title: string;
  description: string;
  imageUrl?: string;
  criteria: {
    trigger: BadgeTrigger;
    moduleId?: mongoose.Types.ObjectId;
    quizId?: mongoose.Types.ObjectId;
    gameId?: mongoose.Types.ObjectId;
    minScore?: number;
    completionThreshold?: number;
  };
  createdAt: Date;
}

export interface IEarnedBadge extends Document {
  userId: mongoose.Types.ObjectId;
  badgeId: mongoose.Types.ObjectId;
  earnedAt: Date;
}

const BadgeSchema = new Schema<IBadge>({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  imageUrl: { type: String },
  criteria: {
    trigger: { type: String, enum: ['module_complete','quiz_pass','quiz_score','game_complete','course_complete'], required: true },
    moduleId: { type: Schema.Types.ObjectId },
    quizId: { type: Schema.Types.ObjectId },
    gameId: { type: Schema.Types.ObjectId },
    minScore: { type: Number },
    completionThreshold: { type: Number },
  },
}, { timestamps: true });

const EarnedBadgeSchema = new Schema<IEarnedBadge>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  badgeId: { type: Schema.Types.ObjectId, ref: 'Badge', required: true },
  earnedAt: { type: Date, default: Date.now },
});

EarnedBadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true });

export const Badge = mongoose.model<IBadge>('Badge', BadgeSchema);
export const EarnedBadge = mongoose.model<IEarnedBadge>('EarnedBadge', EarnedBadgeSchema);
