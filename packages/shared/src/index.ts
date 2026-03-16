// User roles
export type UserRole = 'student' | 'instructor' | 'admin';

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface AuthResponse {
  token: string;
  user: PublicUser;
}

export interface PublicUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

// Module / Curriculum types
export interface Objective {
  _id?: string;
  code: string;
  description: string;
  order: number;
}

export interface Module {
  _id: string;
  code: string;        // e.g. "A", "B", ..., "AA"
  title: string;
  description: string;
  objectives: Objective[];
  order: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Lesson types
export interface Lesson {
  _id: string;
  moduleId: string;
  objectiveId?: string;
  title: string;
  content: string;     // Markdown
  videoUrl?: string;
  imageUrl?: string;
  order: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Quiz types
export type QuestionType = 'multiple_choice' | 'true_false';

export interface QuizQuestion {
  _id?: string;
  type: QuestionType;
  text: string;
  options: string[];      // for multiple_choice: 4 options; for true_false: ['True','False']
  correctIndex: number;
  explanation?: string;
}

export interface Quiz {
  _id: string;
  moduleId: string;
  objectiveId?: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  passingScore: number;  // percentage 0-100
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuizAttempt {
  _id: string;
  quizId: string;
  userId: string;
  answers: number[];      // selected option indices
  score: number;          // percentage
  passed: boolean;
  completedAt: string;
}

// Recipe types
export interface RecipeIngredient {
  name: string;
  quantity: string;
  unit: string;
}

export interface Recipe {
  _id: string;
  title: string;
  description: string;
  ingredients: RecipeIngredient[];
  steps: string[];
  tags: string[];
  allergens: string[];
  servings: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  imageUrl?: string;
  moduleId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Game types
export interface Game {
  _id: string;
  slug: string;           // e.g. "recipe-conversion", "hazard-hunt"
  title: string;
  description: string;
  moduleCode?: string;
  instructions: string;
  maxScore: number;
  createdAt: string;
}

export interface GameAttempt {
  _id: string;
  gameId: string;
  userId: string;
  score: number;
  maxScore: number;
  details?: Record<string, unknown>;
  completedAt: string;
}

// Badge types
export interface Badge {
  _id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl?: string;
  criteria: BadgeCriteria;
  createdAt: string;
}

export type BadgeTrigger = 'module_complete' | 'quiz_pass' | 'quiz_score' | 'game_complete' | 'course_complete';

export interface BadgeCriteria {
  trigger: BadgeTrigger;
  moduleId?: string;
  quizId?: string;
  gameId?: string;
  minScore?: number;       // percentage for quiz_score
  completionThreshold?: number; // percentage for course_complete
}

export interface EarnedBadge {
  _id: string;
  userId: string;
  badgeId: string;
  badge?: Badge;
  earnedAt: string;
}

// Progress types
export interface ModuleProgress {
  moduleId: string;
  moduleCode: string;
  moduleTitle: string;
  lessonsCompleted: number;
  lessonsTotal: number;
  quizzesPassed: number;
  quizzesTotal: number;
  completed: boolean;
}

export interface StudentProgress {
  userId: string;
  modules: ModuleProgress[];
  overallCompletion: number;   // percentage
  badgesEarned: number;
  quizzesTaken: number;
  gamesPlayed: number;
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
}
