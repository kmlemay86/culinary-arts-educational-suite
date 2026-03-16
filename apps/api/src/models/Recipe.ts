import mongoose, { Document, Schema } from 'mongoose';

export interface IRecipeIngredient {
  name: string;
  quantity: string;
  unit: string;
}

export interface IRecipe extends Document {
  title: string;
  description: string;
  ingredients: IRecipeIngredient[];
  steps: string[];
  tags: string[];
  allergens: string[];
  servings: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  imageUrl?: string;
  moduleId?: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const RecipeSchema = new Schema<IRecipe>({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  ingredients: [{
    name: { type: String, required: true },
    quantity: { type: String, required: true },
    unit: { type: String, required: true },
  }],
  steps: [{ type: String }],
  tags: [{ type: String }],
  allergens: [{ type: String }],
  servings: { type: Number, default: 4 },
  prepTimeMinutes: { type: Number, default: 0 },
  cookTimeMinutes: { type: Number, default: 0 },
  imageUrl: { type: String },
  moduleId: { type: Schema.Types.ObjectId, ref: 'Module' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

RecipeSchema.index({ title: 'text', description: 'text', tags: 'text' });

export default mongoose.model<IRecipe>('Recipe', RecipeSchema);
