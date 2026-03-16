import mongoose, { Document, Schema } from 'mongoose';

export interface IObjective {
  _id?: mongoose.Types.ObjectId;
  code: string;
  description: string;
  order: number;
}

export interface IModule extends Document {
  code: string;
  title: string;
  description: string;
  objectives: IObjective[];
  order: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ObjectiveSchema = new Schema<IObjective>({
  code: { type: String, required: true },
  description: { type: String, required: true },
  order: { type: Number, required: true },
});

const ModuleSchema = new Schema<IModule>({
  code: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  objectives: [ObjectiveSchema],
  order: { type: Number, required: true },
  imageUrl: { type: String },
}, { timestamps: true });

export default mongoose.model<IModule>('Module', ModuleSchema);
