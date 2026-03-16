import mongoose, { Document, Schema } from 'mongoose';

export interface IGame extends Document {
  slug: string;
  title: string;
  description: string;
  moduleCode?: string;
  instructions: string;
  maxScore: number;
  createdAt: Date;
}

export interface IGameAttempt extends Document {
  gameId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  score: number;
  maxScore: number;
  details?: Record<string, unknown>;
  completedAt: Date;
}

const GameSchema = new Schema<IGame>({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  moduleCode: { type: String },
  instructions: { type: String, default: '' },
  maxScore: { type: Number, default: 100 },
}, { timestamps: true });

const GameAttemptSchema = new Schema<IGameAttempt>({
  gameId: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  maxScore: { type: Number, required: true },
  details: { type: Schema.Types.Mixed },
  completedAt: { type: Date, default: Date.now },
});

export const Game = mongoose.model<IGame>('Game', GameSchema);
export const GameAttempt = mongoose.model<IGameAttempt>('GameAttempt', GameAttemptSchema);
