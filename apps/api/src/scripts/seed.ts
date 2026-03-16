import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Module from '../models/Module';
import { Game } from '../models/Game';
import { Badge } from '../models/Badge';

dotenv.config();

const CURRICULUM = [
  {
    code: 'A',
    title: 'WORKPLACE SAFETY AND FOOD SAFETY',
    description: 'Covers essential safety practices in the kitchen and foodservice environment, including personal protective equipment, fire safety, and food safety regulations.',
    order: 1,
    objectives: [
      { code: 'A1', description: 'Identify workplace hazards and implement safety procedures', order: 1 },
      { code: 'A2', description: 'Demonstrate proper use of personal protective equipment (PPE)', order: 2 },
      { code: 'A3', description: 'Apply OSHA guidelines in a foodservice setting', order: 3 },
      { code: 'A4', description: 'Explain fire safety procedures including fire extinguisher use', order: 4 },
      { code: 'A5', description: 'Identify and prevent common kitchen accidents', order: 5 },
      { code: 'A6', description: 'Demonstrate proper food handling and storage procedures', order: 6 },
      { code: 'A7', description: 'Explain the temperature danger zone and safe food temperatures', order: 7 },
      { code: 'A8', description: 'Apply cross-contamination prevention techniques', order: 8 },
      { code: 'A9', description: 'Describe proper handwashing procedures and personal hygiene', order: 9 },
      { code: 'A10', description: 'Identify foodborne illnesses and their causes', order: 10 },
    ],
  },
  {
    code: 'B',
    title: 'INTRODUCTION TO THE FOODSERVICE INDUSTRY',
    description: 'Overview of the foodservice industry structure, career pathways, and the history and evolution of culinary arts.',
    order: 2,
    objectives: [
      { code: 'B1', description: 'Describe the scope and structure of the foodservice industry', order: 1 },
      { code: 'B2', description: 'Identify different segments of the foodservice industry', order: 2 },
      { code: 'B3', description: 'Explain the history and evolution of culinary arts', order: 3 },
      { code: 'B4', description: 'Identify career opportunities in the foodservice industry', order: 4 },
      { code: 'B5', description: 'Describe the organizational structure of a professional kitchen (brigade system)', order: 5 },
      { code: 'B6', description: 'Explain the role of each position in the kitchen hierarchy', order: 6 },
    ],
  },
  {
    code: 'C',
    title: 'PROFESSIONALISM AND EMPLOYABILITY SKILLS',
    description: 'Develops professional attributes, work ethic, communication skills, and teamwork essential for success in the culinary industry.',
    order: 3,
    objectives: [
      { code: 'C1', description: 'Demonstrate professional appearance and personal hygiene standards', order: 1 },
      { code: 'C2', description: 'Apply effective communication skills in a professional kitchen', order: 2 },
      { code: 'C3', description: 'Demonstrate teamwork and collaboration skills', order: 3 },
      { code: 'C4', description: 'Exhibit a positive work ethic and professional attitude', order: 4 },
      { code: 'C5', description: 'Identify strategies for managing workplace stress', order: 5 },
      { code: 'C6', description: 'Describe conflict resolution techniques', order: 6 },
    ],
  },
  {
    code: 'D',
    title: 'BASIC CULINARY AND FOOD SERVICE VOCABULARY',
    description: 'Introduces essential culinary terminology, cooking methods, and foodservice vocabulary used in professional kitchens.',
    order: 4,
    objectives: [
      { code: 'D1', description: 'Define and use basic culinary terms correctly', order: 1 },
      { code: 'D2', description: 'Identify and describe common cooking methods and techniques', order: 2 },
      { code: 'D3', description: 'Use standardized foodservice vocabulary in written and oral communication', order: 3 },
      { code: 'D4', description: 'Identify French culinary terms commonly used in professional kitchens', order: 4 },
    ],
  },
  {
    code: 'E',
    title: 'CULINARY MATH AND MEASUREMENTS',
    description: 'Covers essential math skills for the kitchen including measurements, conversions, recipe scaling, food costing, and yield calculations.',
    order: 5,
    objectives: [
      { code: 'E1', description: 'Convert between U.S. standard and metric measurements', order: 1 },
      { code: 'E2', description: 'Scale recipes up and down accurately', order: 2 },
      { code: 'E3', description: 'Calculate food cost percentage and portion cost', order: 3 },
      { code: 'E4', description: 'Apply yield percentage calculations', order: 4 },
      { code: 'E5', description: 'Use fractions and decimals in recipe calculations', order: 5 },
      { code: 'E6', description: 'Calculate as-purchased (AP) vs. edible portion (EP) quantities', order: 6 },
    ],
  },
  {
    code: 'F',
    title: 'COMMON INGREDIENTS',
    description: 'Familiarizes students with common culinary ingredients including their characteristics, uses, purchasing, and storage.',
    order: 6,
    objectives: [
      { code: 'F1', description: 'Identify and describe common herbs and spices', order: 1 },
      { code: 'F2', description: 'Identify and describe common vegetables and their culinary uses', order: 2 },
      { code: 'F3', description: 'Identify and describe common proteins (meat, poultry, seafood)', order: 3 },
      { code: 'F4', description: 'Identify and describe common dairy products and eggs', order: 4 },
      { code: 'F5', description: 'Identify and describe grains, legumes, and starches', order: 5 },
      { code: 'F6', description: 'Explain proper storage procedures for common ingredients', order: 6 },
    ],
  },
  {
    code: 'G',
    title: 'NUTRITION',
    description: 'Covers basic nutrition principles, macronutrients and micronutrients, dietary guidelines, and how to create nutritionally balanced meals.',
    order: 7,
    objectives: [
      { code: 'G1', description: 'Identify the six essential nutrients and their functions', order: 1 },
      { code: 'G2', description: 'Explain the USDA MyPlate dietary guidelines', order: 2 },
      { code: 'G3', description: 'Interpret a Nutrition Facts label', order: 3 },
      { code: 'G4', description: 'Describe how cooking methods affect nutritional value', order: 4 },
      { code: 'G5', description: 'Plan nutritionally balanced meals', order: 5 },
      { code: 'G6', description: 'Identify common dietary restrictions and allergens', order: 6 },
    ],
  },
  {
    code: 'H',
    title: 'INTRODUCTION TO SUSTAINABILITY',
    description: 'Introduces sustainable practices in the foodservice industry including farm-to-table concepts, waste reduction, and environmental responsibility.',
    order: 8,
    objectives: [
      { code: 'H1', description: 'Define sustainability in the context of foodservice', order: 1 },
      { code: 'H2', description: 'Explain farm-to-table and locally sourced food concepts', order: 2 },
      { code: 'H3', description: 'Describe waste reduction strategies in the kitchen', order: 3 },
      { code: 'H4', description: 'Identify environmentally friendly practices in foodservice operations', order: 4 },
      { code: 'H5', description: 'Explain the impact of food choices on the environment', order: 5 },
    ],
  },
  {
    code: 'I',
    title: 'ORGANIZATION AND TIME MANAGEMENT',
    description: 'Develops mise en place skills, kitchen organization, and time management techniques essential for professional kitchen efficiency.',
    order: 9,
    objectives: [
      { code: 'I1', description: 'Define and apply the concept of mise en place', order: 1 },
      { code: 'I2', description: 'Create and follow a prep list and production schedule', order: 2 },
      { code: 'I3', description: 'Demonstrate effective workstation organization', order: 3 },
      { code: 'I4', description: 'Apply time management strategies during service', order: 4 },
      { code: 'I5', description: 'Prioritize tasks in a high-pressure kitchen environment', order: 5 },
    ],
  },
  {
    code: 'J',
    title: 'FRONT-OF-THE-HOUSE',
    description: 'Covers front-of-house operations including customer service, table service styles, menu knowledge, and restaurant management basics.',
    order: 10,
    objectives: [
      { code: 'J1', description: 'Describe the roles and responsibilities of front-of-house staff', order: 1 },
      { code: 'J2', description: 'Demonstrate proper table service etiquette', order: 2 },
      { code: 'J3', description: 'Apply effective customer service techniques', order: 3 },
      { code: 'J4', description: 'Identify different table service styles (American, French, Russian, etc.)', order: 4 },
      { code: 'J5', description: 'Explain the importance of menu knowledge for service staff', order: 5 },
    ],
  },
  {
    code: 'K',
    title: 'TOOLS AND EQUIPMENT',
    description: 'Identification, proper use, maintenance, and safety of professional kitchen tools, small equipment, and major appliances.',
    order: 11,
    objectives: [
      { code: 'K1', description: 'Identify and describe hand tools and small equipment used in professional kitchens', order: 1 },
      { code: 'K2', description: 'Demonstrate safe and proper use of kitchen equipment', order: 2 },
      { code: 'K3', description: 'Describe the proper maintenance and cleaning of kitchen equipment', order: 3 },
      { code: 'K4', description: 'Identify and explain major kitchen appliances (ovens, ranges, fryers, etc.)', order: 4 },
      { code: 'K5', description: 'Select appropriate tools and equipment for specific tasks', order: 5 },
    ],
  },
  {
    code: 'L',
    title: 'BASIC KNIFE SKILLS',
    description: 'Covers knife selection, safety, proper grip, and fundamental cutting techniques used in professional kitchens.',
    order: 12,
    objectives: [
      { code: 'L1', description: 'Identify the parts of a chef\'s knife and their functions', order: 1 },
      { code: 'L2', description: 'Demonstrate safe knife handling and storage procedures', order: 2 },
      { code: 'L3', description: 'Apply the proper grip and cutting stance', order: 3 },
      { code: 'L4', description: 'Perform basic cuts: julienne, brunoise, dice, chiffonade, and chop', order: 4 },
      { code: 'L5', description: 'Maintain knife sharpness using a honing steel and whetstone', order: 5 },
      { code: 'L6', description: 'Select the appropriate knife for specific tasks', order: 6 },
    ],
  },
  {
    code: 'M',
    title: 'UTILITY STATION, KITCHEN STEWARD',
    description: 'Covers the roles, responsibilities, and skills of kitchen utility and steward positions including dishwashing, sanitation, and support tasks.',
    order: 13,
    objectives: [
      { code: 'M1', description: 'Describe the role and responsibilities of a kitchen steward', order: 1 },
      { code: 'M2', description: 'Demonstrate proper dishwashing and sanitizing procedures', order: 2 },
      { code: 'M3', description: 'Apply cleaning and sanitation schedules', order: 3 },
      { code: 'M4', description: 'Explain the importance of the utility position in kitchen operations', order: 4 },
      { code: 'M5', description: 'Demonstrate proper handling and disposal of waste', order: 5 },
    ],
  },
  {
    code: 'N',
    title: 'RECIPE BASICS',
    description: 'Introduces standardized recipes, recipe formats, reading and following recipes accurately, and recipe development fundamentals.',
    order: 14,
    objectives: [
      { code: 'N1', description: 'Identify the components of a standardized recipe', order: 1 },
      { code: 'N2', description: 'Read and follow a recipe accurately', order: 2 },
      { code: 'N3', description: 'Convert recipe yields using conversion factors', order: 3 },
      { code: 'N4', description: 'Write a standardized recipe using correct format', order: 4 },
      { code: 'N5', description: 'Explain the importance of standardized recipes in foodservice', order: 5 },
    ],
  },
  {
    code: 'O',
    title: 'MENU BASICS',
    description: 'Covers menu types, menu planning principles, menu design, pricing strategies, and the role of the menu in restaurant operations.',
    order: 15,
    objectives: [
      { code: 'O1', description: 'Identify the different types of menus (à la carte, table d\'hôte, cycle, etc.)', order: 1 },
      { code: 'O2', description: 'Explain the principles of menu planning and design', order: 2 },
      { code: 'O3', description: 'Describe factors that influence menu pricing', order: 3 },
      { code: 'O4', description: 'Identify menu categories and their typical contents', order: 4 },
      { code: 'O5', description: 'Analyze a restaurant menu for balance, variety, and profitability', order: 5 },
    ],
  },
  {
    code: 'P',
    title: 'BASIC KITCHEN ECONOMICS',
    description: 'Covers food cost control, inventory management, portion control, purchasing, and the financial aspects of running a kitchen.',
    order: 16,
    objectives: [
      { code: 'P1', description: 'Explain the concept of food cost and its impact on profitability', order: 1 },
      { code: 'P2', description: 'Calculate food cost percentage', order: 2 },
      { code: 'P3', description: 'Describe inventory management procedures', order: 3 },
      { code: 'P4', description: 'Apply portion control techniques', order: 4 },
      { code: 'P5', description: 'Explain purchasing procedures and receiving practices', order: 5 },
      { code: 'P6', description: 'Identify strategies for reducing food waste and controlling costs', order: 6 },
    ],
  },
  {
    code: 'Q',
    title: 'BASIC COOKING PRINCIPLES',
    description: 'Covers the science of cooking, heat transfer methods, dry and moist heat cooking techniques, and the Maillard reaction.',
    order: 17,
    objectives: [
      { code: 'Q1', description: 'Explain the three methods of heat transfer (conduction, convection, radiation)', order: 1 },
      { code: 'Q2', description: 'Describe dry heat cooking methods (sauté, roast, broil, grill, fry)', order: 2 },
      { code: 'Q3', description: 'Describe moist heat cooking methods (boil, simmer, steam, poach, braise)', order: 3 },
      { code: 'Q4', description: 'Explain combination cooking methods (braise, stew)', order: 4 },
      { code: 'Q5', description: 'Describe the Maillard reaction and caramelization', order: 5 },
      { code: 'Q6', description: 'Apply appropriate cooking methods to different ingredients', order: 6 },
    ],
  },
  {
    code: 'R',
    title: 'BREAKFAST',
    description: 'Covers breakfast cookery including eggs, cereals, pancakes, waffles, meats, and other breakfast items prepared in a professional kitchen.',
    order: 18,
    objectives: [
      { code: 'R1', description: 'Demonstrate proper egg cookery methods (scrambled, fried, poached, omelets)', order: 1 },
      { code: 'R2', description: 'Prepare hot and cold cereals correctly', order: 2 },
      { code: 'R3', description: 'Prepare pancakes, waffles, and French toast', order: 3 },
      { code: 'R4', description: 'Cook breakfast meats (bacon, sausage, ham)', order: 4 },
      { code: 'R5', description: 'Set up and operate a breakfast station efficiently', order: 5 },
    ],
  },
  {
    code: 'S',
    title: 'SALADS, DRESSING, AND SANDWICHES (PANTRY)',
    description: 'Covers preparation of salads, dressings, and sandwiches including pantry station organization and cold food production.',
    order: 19,
    objectives: [
      { code: 'S1', description: 'Identify and prepare different types of salads (tossed, composed, bound)', order: 1 },
      { code: 'S2', description: 'Prepare vinaigrettes and creamy dressings from scratch', order: 2 },
      { code: 'S3', description: 'Prepare hot and cold sandwiches using proper techniques', order: 3 },
      { code: 'S4', description: 'Demonstrate proper pantry station organization and mise en place', order: 4 },
      { code: 'S5', description: 'Apply food safety practices to cold food production', order: 5 },
    ],
  },
  {
    code: 'T',
    title: 'STOCKS',
    description: 'Covers the preparation of classical stocks including chicken, beef, fish, and vegetable stocks, and their role as the foundation of French cuisine.',
    order: 20,
    objectives: [
      { code: 'T1', description: 'Explain the role of stocks as the foundation of classical cuisine', order: 1 },
      { code: 'T2', description: 'Identify the five classical stocks and their components', order: 2 },
      { code: 'T3', description: 'Prepare white stock (chicken or veal)', order: 3 },
      { code: 'T4', description: 'Prepare brown stock (beef or veal)', order: 4 },
      { code: 'T5', description: 'Prepare fish stock (fumet)', order: 5 },
      { code: 'T6', description: 'Prepare vegetable stock', order: 6 },
      { code: 'T7', description: 'Apply proper storage and handling of stocks', order: 7 },
    ],
  },
  {
    code: 'U',
    title: 'SAUCES',
    description: 'Covers the five mother sauces and their derivatives, sauce making techniques, and the role of sauces in classical and modern cuisine.',
    order: 21,
    objectives: [
      { code: 'U1', description: 'Identify the five French mother sauces (Béchamel, Velouté, Espagnole, Sauce Tomate, Hollandaise)', order: 1 },
      { code: 'U2', description: 'Prepare Béchamel sauce and its derivatives', order: 2 },
      { code: 'U3', description: 'Prepare Velouté sauce and its derivatives', order: 3 },
      { code: 'U4', description: 'Prepare Espagnole and demi-glace', order: 4 },
      { code: 'U5', description: 'Prepare Hollandaise and its derivatives', order: 5 },
      { code: 'U6', description: 'Prepare contemporary sauces (pan sauces, vinaigrettes, coulis)', order: 6 },
    ],
  },
  {
    code: 'V',
    title: 'SOUPS',
    description: 'Covers classical and modern soup preparation including clear soups, cream soups, purée soups, and specialty soups.',
    order: 22,
    objectives: [
      { code: 'V1', description: 'Classify soups into their major categories', order: 1 },
      { code: 'V2', description: 'Prepare clear soups (consommé, broth, bouillon)', order: 2 },
      { code: 'V3', description: 'Prepare cream soups using proper techniques', order: 3 },
      { code: 'V4', description: 'Prepare purée soups', order: 4 },
      { code: 'V5', description: 'Prepare specialty soups (bisque, chowder, gazpacho)', order: 5 },
      { code: 'V6', description: 'Apply proper garnishing and service techniques for soups', order: 6 },
    ],
  },
  {
    code: 'W',
    title: 'HOT STATION PREPARATION AND PRODUCTION',
    description: 'Covers hot station operations including preparation and production of proteins, vegetables, and starches in a professional kitchen environment.',
    order: 23,
    objectives: [
      { code: 'W1', description: 'Set up and organize a hot station for service', order: 1 },
      { code: 'W2', description: 'Prepare and cook proteins to correct internal temperatures', order: 2 },
      { code: 'W3', description: 'Prepare and cook vegetables using appropriate methods', order: 3 },
      { code: 'W4', description: 'Prepare starch dishes (pasta, rice, potatoes)', order: 4 },
      { code: 'W5', description: 'Demonstrate speed and efficiency during service', order: 5 },
      { code: 'W6', description: 'Apply quality standards for hot food production', order: 6 },
    ],
  },
  {
    code: 'X',
    title: 'PLATING',
    description: 'Covers the principles and techniques of professional food plating, garnishing, and food presentation for both hot and cold dishes.',
    order: 24,
    objectives: [
      { code: 'X1', description: 'Explain the principles of plate composition and design', order: 1 },
      { code: 'X2', description: 'Apply color, texture, and height principles in plating', order: 2 },
      { code: 'X3', description: 'Demonstrate classical and contemporary plating techniques', order: 3 },
      { code: 'X4', description: 'Prepare and apply appropriate garnishes', order: 4 },
      { code: 'X5', description: 'Plate food to meet professional standards', order: 5 },
    ],
  },
  {
    code: 'Y',
    title: 'BAKESHOP',
    description: 'Introduction to baking principles, baking ingredients and their functions, and basic bakeshop products including breads, pastries, and desserts.',
    order: 25,
    objectives: [
      { code: 'Y1', description: 'Identify baking ingredients and explain their functions', order: 1 },
      { code: 'Y2', description: 'Explain the role of gluten in baking', order: 2 },
      { code: 'Y3', description: 'Prepare yeast breads using proper techniques', order: 3 },
      { code: 'Y4', description: 'Prepare quick breads, muffins, and biscuits', order: 4 },
      { code: 'Y5', description: 'Prepare basic pastry doughs (pie crust, pâte brisée)', order: 5 },
      { code: 'Y6', description: 'Prepare basic cookies and cakes', order: 6 },
      { code: 'Y7', description: 'Apply correct baking temperatures and times', order: 7 },
    ],
  },
  {
    code: 'Z',
    title: 'SERVSAFE FOOD PROTECTION MANAGER',
    description: 'Comprehensive food safety management covering HACCP principles, food safety regulations, sanitation programs, and ServSafe certification preparation.',
    order: 26,
    objectives: [
      { code: 'Z1', description: 'Explain HACCP principles and their application in foodservice', order: 1 },
      { code: 'Z2', description: 'Identify critical control points in food production', order: 2 },
      { code: 'Z3', description: 'Describe food safety regulations and inspection procedures', order: 3 },
      { code: 'Z4', description: 'Develop and implement a sanitation program', order: 4 },
      { code: 'Z5', description: 'Prepare for the ServSafe Food Protection Manager certification exam', order: 5 },
      { code: 'Z6', description: 'Apply food safety management principles in real kitchen scenarios', order: 6 },
    ],
  },
  {
    code: 'AA',
    title: 'EMPLOYABILITY SKILLS',
    description: 'Covers job searching, resume writing, interview skills, workplace expectations, and career development strategies for the culinary industry.',
    order: 27,
    objectives: [
      { code: 'AA1', description: 'Prepare a professional resume and cover letter for culinary positions', order: 1 },
      { code: 'AA2', description: 'Demonstrate effective job interview skills', order: 2 },
      { code: 'AA3', description: 'Identify career pathways and advancement opportunities in culinary arts', order: 3 },
      { code: 'AA4', description: 'Explain workplace rights and responsibilities', order: 4 },
      { code: 'AA5', description: 'Develop a personal career plan for the culinary industry', order: 5 },
      { code: 'AA6', description: 'Demonstrate professional networking skills', order: 6 },
    ],
  },
];

const GAMES = [
  {
    slug: 'recipe-conversion',
    title: 'Recipe Conversion Challenge',
    description: 'Practice scaling recipes up and down using culinary math. Master conversions between units and scale your recipes like a pro!',
    moduleCode: 'E',
    instructions: 'You will be given a recipe and asked to scale it to a different yield. Enter the correct amounts for each ingredient to earn points. You have limited time for each question!',
    maxScore: 100,
  },
  {
    slug: 'hazard-hunt',
    title: 'Kitchen Safety Hazard Hunt',
    description: 'Spot the safety hazards in various kitchen scenarios. Test your knowledge of food safety and workplace safety principles!',
    moduleCode: 'A',
    instructions: 'Examine each kitchen scenario and identify all the safety hazards present. Click on each hazard you spot. The faster you find them, the higher your score!',
    maxScore: 100,
  },
];

const BADGES = [
  {
    slug: 'first-quiz',
    title: 'Quiz Taker',
    description: 'Completed your first quiz!',
    imageUrl: '🎯',
    criteria: { trigger: 'quiz_pass' as const },
  },
  {
    slug: 'high-scorer',
    title: 'High Scorer',
    description: 'Scored 90% or higher on a quiz!',
    imageUrl: '⭐',
    criteria: { trigger: 'quiz_score' as const, minScore: 90 },
  },
  {
    slug: 'game-player',
    title: 'Game On!',
    description: 'Completed your first game!',
    imageUrl: '🎮',
    criteria: { trigger: 'game_complete' as const },
  },
  {
    slug: 'module-master',
    title: 'Module Master',
    description: 'Completed all lessons in a module!',
    imageUrl: '🏆',
    criteria: { trigger: 'module_complete' as const },
  },
  {
    slug: 'safety-star',
    title: 'Safety Star',
    description: 'Mastered the Kitchen Safety Hazard Hunt game!',
    imageUrl: '🛡️',
    criteria: { trigger: 'game_complete' as const },
  },
  {
    slug: 'course-complete',
    title: 'Culinary Graduate',
    description: 'Completed 80% or more of the course!',
    imageUrl: '🎓',
    criteria: { trigger: 'course_complete' as const, completionThreshold: 80 },
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/culinary_suite?authSource=admin';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  // Seed modules
  console.log('Seeding curriculum modules...');
  for (const mod of CURRICULUM) {
    await Module.findOneAndUpdate(
      { code: mod.code },
      mod,
      { upsert: true, new: true }
    );
    console.log(`  ✓ Module ${mod.code}: ${mod.title}`);
  }

  // Seed games
  console.log('Seeding games...');
  for (const game of GAMES) {
    await Game.findOneAndUpdate(
      { slug: game.slug },
      game,
      { upsert: true, new: true }
    );
    console.log(`  ✓ Game: ${game.title}`);
  }

  // Seed badges
  console.log('Seeding badges...');
  for (const badge of BADGES) {
    await Badge.findOneAndUpdate(
      { slug: badge.slug },
      badge,
      { upsert: true, new: true }
    );
    console.log(`  ✓ Badge: ${badge.title}`);
  }

  console.log('\n✅ Seed complete!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
