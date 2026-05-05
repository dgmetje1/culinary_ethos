import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const { Category } = require('./content/domain/models/category.entity');
const { Unit } = require('./content/domain/models/unit.entity');
const { Ingredient } = require('./content/domain/models/ingredient.entity');
const { Kitchenware } = require('./content/domain/models/kitchenware.entity');
const { Recipe } = require('./content/domain/models/recipe.entity');
const { User } = require('./users/user.entity');

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [Category, Unit, Ingredient, Kitchenware, Recipe, User],
  });

  await dataSource.initialize();
  const em = dataSource.manager;

  console.log('Seeding categories...');
  const categories = [
    { id: 'cat_breakfast', content: [{ language: 'en', name: 'Breakfast', description: 'Morning meal recipes' }] },
    { id: 'cat_lunch', content: [{ language: 'en', name: 'Lunch', description: 'Midday meal recipes' }] },
    { id: 'cat_dinner', content: [{ language: 'en', name: 'Dinner', description: 'Evening meal recipes' }] },
    { id: 'cat_dessert', content: [{ language: 'en', name: 'Dessert', description: 'Sweet treats' }] },
    { id: 'cat_snack', content: [{ language: 'en', name: 'Snack', description: 'Light bites' }] },
  ];
  for (const cat of categories) {
    await em.save(Category, cat);
  }

  console.log('Seeding units...');
  const units = [
    { id: 'unit_cup', isVisible: true, content: [{ language: 'en', name: 'Cup', shortName: 'cup', singularName: 'Cup' }] },
    { id: 'unit_tbsp', isVisible: true, content: [{ language: 'en', name: 'Tablespoon', shortName: 'tbsp', singularName: 'Tablespoon' }] },
    { id: 'unit_tsp', isVisible: true, content: [{ language: 'en', name: 'Teaspoon', shortName: 'tsp', singularName: 'Teaspoon' }] },
    { id: 'unit_g', isVisible: true, content: [{ language: 'en', name: 'Gram', shortName: 'g', singularName: 'Gram' }] },
    { id: 'unit_ml', isVisible: true, content: [{ language: 'en', name: 'Milliliter', shortName: 'ml', singularName: 'Milliliter' }] },
    { id: 'unit_l', isVisible: true, content: [{ language: 'en', name: 'Liter', shortName: 'L', singularName: 'Liter' }] },
    { id: 'unit_piece', isVisible: true, content: [{ language: 'en', name: 'Piece', shortName: 'pc', singularName: 'Piece' }] },
    { id: 'unit_oz', isVisible: true, content: [{ language: 'en', name: 'Ounce', shortName: 'oz', singularName: 'Ounce' }] },
  ];
  for (const unit of units) {
    await em.save(Unit, unit);
  }

  console.log('Seeding ingredients...');
  const ingredients = [
    { id: 'ing_flour', content: [{ language: 'en', name: 'All-purpose flour', singularName: 'Flour' }] },
    { id: 'ing_sugar', content: [{ language: 'en', name: 'Sugar', singularName: 'Sugar' }] },
    { id: 'ing_salt', content: [{ language: 'en', name: 'Salt', singularName: 'Salt' }] },
    { id: 'ing_eggs', content: [{ language: 'en', name: 'Eggs', singularName: 'Egg' }] },
    { id: 'ing_milk', content: [{ language: 'en', name: 'Milk', singularName: 'Milk' }] },
    { id: 'ing_butter', content: [{ language: 'en', name: 'Butter', singularName: 'Butter' }] },
    { id: 'ing_oil', content: [{ language: 'en', name: 'Vegetable oil', singularName: 'Oil' }] },
    { id: 'ing_yeast', content: [{ language: 'en', name: 'Yeast', singularName: 'Yeast' }] },
    { id: 'ing_water', content: [{ language: 'en', name: 'Water', singularName: 'Water' }] },
    { id: 'ing_chocolate', content: [{ language: 'en', name: 'Chocolate', singularName: 'Chocolate' }] },
    { id: 'ing_vanilla', content: [{ language: 'en', name: 'Vanilla extract', singularName: 'Vanilla' }] },
    { id: 'ing_baking_powder', content: [{ language: 'en', name: 'Baking powder', singularName: 'Baking powder' }] },
    { id: 'ing_cocoa', content: [{ language: 'en', name: 'Cocoa powder', singularName: 'Cocoa' }] },
    { id: 'ing_cream', content: [{ language: 'en', name: 'Heavy cream', singularName: 'Cream' }] },
    { id: 'ing_cheese', content: [{ language: 'en', name: 'Cheddar cheese', singularName: 'Cheese' }] },
  ];
  for (const ing of ingredients) {
    await em.save(Ingredient, ing);
  }

  console.log('Seeding kitchenware...');
  const kitchenware = [
    { id: 'kw_bowl', name: 'Mixing bowl', description: 'Large bowl for mixing ingredients' },
    { id: 'kw_whisk', name: 'Whisk', description: 'For beating eggs' },
    { id: 'kw_oven', name: 'Oven', description: 'For baking' },
    { id: 'kw_mixer', name: 'Stand mixer', description: 'Electric mixer' },
    { id: 'kw_pan', name: 'Frying pan', description: 'Non-stick pan' },
    { id: 'kw_sheet', name: 'Baking sheet', description: 'For cookies' },
    { id: 'kw_spatula', name: 'Spatula', description: 'For stirring' },
  ];
  for (const kw of kitchenware) {
    await em.save(Kitchenware, kw);
  }

  console.log('Seeding recipes...');
  await em.save(Recipe, {
    id: 'recipe_pancakes',
    difficulty: 1,
    time: 20,
    portions: 4,
    visibility: 1,
    author: 'system',
    uniqueId: 'abc123',
    publications: [{ language: 'en', title: 'Classic Pancakes', description: 'Fluffy homemade pancakes' }],
    steps: [{ number: 1, content: [{ language: 'en', title: 'Mix', body: '<p>Mix all ingredients</p>' }] }],
    ingredients: [],
    kitchenware: [],
    categoryIds: ['cat_breakfast'],
  });

  await em.save(Recipe, {
    id: 'recipe_chocolate_cake',
    difficulty: 3,
    time: 60,
    portions: 8,
    visibility: 1,
    author: 'system',
    uniqueId: 'def456',
    publications: [{ language: 'en', title: 'Chocolate Cake', description: 'Rich chocolate cake' }],
    steps: [{ number: 1, content: [{ language: 'en', title: 'Bake', body: '<p>Bake at 350F for 30 minutes.</p>' }] }],
    ingredients: [],
    kitchenware: [],
    categoryIds: ['cat_dessert'],
  });

  await dataSource.destroy();
  console.log('Seeding complete!');
}

seed().catch(console.error);