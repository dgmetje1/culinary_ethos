import { DataSource } from 'typeorm';
import { ulid } from 'ulidx';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const { Category } = require('./content/domain/models/category.entity');
const { Unit } = require('./content/domain/models/unit.entity');
const { Ingredient } = require('./content/domain/models/ingredient.entity');
const { Kitchenware } = require('./content/domain/models/kitchenware.entity');
const { Recipe } = require('./content/domain/models/recipe.entity');
const { User } = require('./social/domain/models/user.entity');

const CAT_BREAKFAST = ulid();
const CAT_LUNCH = ulid();
const CAT_DINNER = ulid();
const CAT_DESSERT = ulid();
const CAT_SNACK = ulid();

const UNIT_CUP = ulid();
const UNIT_TBSP = ulid();
const UNIT_TSP = ulid();
const UNIT_G = ulid();
const UNIT_ML = ulid();
const UNIT_L = ulid();
const UNIT_PIECE = ulid();
const UNIT_OZ = ulid();

const ING_FLOUR = ulid();
const ING_SUGAR = ulid();
const ING_SALT = ulid();
const ING_EGGS = ulid();
const ING_MILK = ulid();
const ING_BUTTER = ulid();
const ING_OIL = ulid();
const ING_YEAST = ulid();
const ING_WATER = ulid();
const ING_CHOCOLATE = ulid();
const ING_VANILLA = ulid();
const ING_BAKING_POWDER = ulid();
const ING_COCOA = ulid();
const ING_CREAM = ulid();
const ING_CHEESE = ulid();

const RECIPE_PANCAKES = ulid();
const RECIPE_CHOCOLATE_CAKE = ulid();
const RECIPE_SPAGHETTI_CARBONARA = ulid();
const RECIPE_CAESAR_SALAD = ulid();
const RECIPE_BEEF_TACOS = ulid();
const RECIPE_BERRY_SMOOTHIE = ulid();
const RECIPE_GRILLED_SALMON = ulid();
const RECIPE_CHOCOLATE_MOUSSE = ulid();
const RECIPE_VEGGIE_STIR_FRY = ulid();
const RECIPE_FRENCH_TOAST = ulid();
const RECIPE_SHRIMP_PAELLA = ulid();
const RECIPE_LEMON_CHEESECAKE = ulid();
const RECIPE_AVOCADO_TOAST = ulid();

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

  console.log('Cleaning existing data...');
  await em.clear(Recipe);
  await em.clear(Ingredient);
  await em.clear(Kitchenware);
  await em.clear(Unit);
  await em.clear(Category);
  console.log('Clean complete.');

  console.log('Seeding admin user...');
  await em.upsert(
    User,
    {
      id: '01KSB2HG9QT802B103JT6E1ZFH',
      account_id: 'auth0|6a5f5e5d6fcdc3659ab02225',
      nick_name: 'admin',
      name: 'Admin',
      last_name: 'User',
      email: 'admin@example.com',
      language: 'en',
      profile_picture: null,
      role: 'admin',
      status: 'active',
    },
    ['id'],
  );
  console.log('Admin user seeded.');

  console.log('Seeding categories...');
  const categories = [
    {
      id: CAT_BREAKFAST,
      content: [
        {
          language: 'en',
          name: 'Breakfast',
          description: 'Morning meal recipes',
        },
        {
          language: 'es',
          name: 'Desayuno',
          description: 'Recetas de comida matutina',
        },
      ],
    },
    {
      id: CAT_LUNCH,
      content: [
        { language: 'en', name: 'Lunch', description: 'Midday meal recipes' },
        {
          language: 'es',
          name: 'Almuerzo',
          description: 'Recetas de comida del mediodia',
        },
      ],
    },
    {
      id: CAT_DINNER,
      content: [
        { language: 'en', name: 'Dinner', description: 'Evening meal recipes' },
        {
          language: 'es',
          name: 'Cena',
          description: 'Recetas de comida de la noche',
        },
      ],
    },
    {
      id: CAT_DESSERT,
      content: [
        { language: 'en', name: 'Dessert', description: 'Sweet treats' },
        { language: 'es', name: 'Postre', description: 'Dulces golosinas' },
      ],
    },
    {
      id: CAT_SNACK,
      content: [
        { language: 'en', name: 'Snack', description: 'Light bites' },
        { language: 'es', name: 'Merienda', description: 'Bocados ligeros' },
      ],
    },
  ];
  for (const cat of categories) {
    await em.save(Category, cat);
  }

  console.log('Seeding units...');
  const units = [
    {
      id: UNIT_CUP,
      isVisible: true,
      content: [
        { language: 'en', name: 'Cup', shortName: 'cup', singularName: 'Cup' },
        {
          language: 'es',
          name: 'Taza',
          shortName: 'taza',
          singularName: 'Taza',
        },
      ],
    },
    {
      id: UNIT_TBSP,
      isVisible: true,
      content: [
        {
          language: 'en',
          name: 'Tablespoon',
          shortName: 'tbsp',
          singularName: 'Tablespoon',
        },
        {
          language: 'es',
          name: 'Cucharada',
          shortName: 'cdta',
          singularName: 'Cucharada',
        },
      ],
    },
    {
      id: UNIT_TSP,
      isVisible: true,
      content: [
        {
          language: 'en',
          name: 'Teaspoon',
          shortName: 'tsp',
          singularName: 'Teaspoon',
        },
        {
          language: 'es',
          name: 'Cucharadita',
          shortName: 'cdita',
          singularName: 'Cucharadita',
        },
      ],
    },
    {
      id: UNIT_G,
      isVisible: true,
      content: [
        { language: 'en', name: 'Gram', shortName: 'g', singularName: 'Gram' },
        {
          language: 'es',
          name: 'Gramo',
          shortName: 'g',
          singularName: 'Gramo',
        },
      ],
    },
    {
      id: UNIT_ML,
      isVisible: true,
      content: [
        {
          language: 'en',
          name: 'Milliliter',
          shortName: 'ml',
          singularName: 'Milliliter',
        },
        {
          language: 'es',
          name: 'Mililitro',
          shortName: 'ml',
          singularName: 'Mililitro',
        },
      ],
    },
    {
      id: UNIT_L,
      isVisible: true,
      content: [
        {
          language: 'en',
          name: 'Liter',
          shortName: 'L',
          singularName: 'Liter',
        },
        {
          language: 'es',
          name: 'Litro',
          shortName: 'L',
          singularName: 'Litro',
        },
      ],
    },
    {
      id: UNIT_PIECE,
      isVisible: true,
      content: [
        {
          language: 'en',
          name: 'Piece',
          shortName: 'pc',
          singularName: 'Piece',
        },
        {
          language: 'es',
          name: 'Pieza',
          shortName: 'pza',
          singularName: 'Pieza',
        },
      ],
    },
    {
      id: UNIT_OZ,
      isVisible: true,
      content: [
        {
          language: 'en',
          name: 'Ounce',
          shortName: 'oz',
          singularName: 'Ounce',
        },
        { language: 'es', name: 'Onza', shortName: 'oz', singularName: 'Onza' },
      ],
    },
  ];
  for (const unit of units) {
    await em.save(Unit, unit);
  }

  console.log('Seeding ingredients...');
  const ingredients = [
    {
      id: ING_FLOUR,
      content: [
        { language: 'en', name: 'All-purpose flour', singularName: 'Flour' },
        {
          language: 'es',
          name: 'Harina multifuncional',
          singularName: 'Harina',
        },
      ],
    },
    {
      id: ING_SUGAR,
      content: [
        { language: 'en', name: 'Sugar', singularName: 'Sugar' },
        { language: 'es', name: 'Azucar', singularName: 'Azucar' },
      ],
    },
    {
      id: ING_SALT,
      content: [
        { language: 'en', name: 'Salt', singularName: 'Salt' },
        { language: 'es', name: 'Sal', singularName: 'Sal' },
      ],
    },
    {
      id: ING_EGGS,
      content: [
        { language: 'en', name: 'Eggs', singularName: 'Egg' },
        { language: 'es', name: 'Huevos', singularName: 'Huevo' },
      ],
    },
    {
      id: ING_MILK,
      content: [
        { language: 'en', name: 'Milk', singularName: 'Milk' },
        { language: 'es', name: 'Leche', singularName: 'Leche' },
      ],
    },
    {
      id: ING_BUTTER,
      content: [
        { language: 'en', name: 'Butter', singularName: 'Butter' },
        { language: 'es', name: 'Mantequilla', singularName: 'Mantequilla' },
      ],
    },
    {
      id: ING_OIL,
      content: [
        { language: 'en', name: 'Vegetable oil', singularName: 'Oil' },
        { language: 'es', name: 'Aceite vegetal', singularName: 'Aceite' },
      ],
    },
    {
      id: ING_YEAST,
      content: [
        { language: 'en', name: 'Yeast', singularName: 'Yeast' },
        { language: 'es', name: 'Levadura', singularName: 'Levadura' },
      ],
    },
    {
      id: ING_WATER,
      content: [
        { language: 'en', name: 'Water', singularName: 'Water' },
        { language: 'es', name: 'Agua', singularName: 'Agua' },
      ],
    },
    {
      id: ING_CHOCOLATE,
      content: [
        { language: 'en', name: 'Chocolate', singularName: 'Chocolate' },
        { language: 'es', name: 'Chocolate', singularName: 'Chocolate' },
      ],
    },
    {
      id: ING_VANILLA,
      content: [
        { language: 'en', name: 'Vanilla extract', singularName: 'Vanilla' },
        {
          language: 'es',
          name: 'Extracto de vainilla',
          singularName: 'Vainilla',
        },
      ],
    },
    {
      id: ING_BAKING_POWDER,
      content: [
        {
          language: 'en',
          name: 'Baking powder',
          singularName: 'Baking powder',
        },
        {
          language: 'es',
          name: 'Polvo de hornear',
          singularName: 'Polvo de hornear',
        },
      ],
    },
    {
      id: ING_COCOA,
      content: [
        { language: 'en', name: 'Cocoa powder', singularName: 'Cocoa' },
        { language: 'es', name: 'Cacao en polvo', singularName: 'Cacao' },
      ],
    },
    {
      id: ING_CREAM,
      content: [
        { language: 'en', name: 'Heavy cream', singularName: 'Cream' },
        { language: 'es', name: 'Nata para montar', singularName: 'Nata' },
      ],
    },
    {
      id: ING_CHEESE,
      content: [
        { language: 'en', name: 'Cheddar cheese', singularName: 'Cheese' },
        { language: 'es', name: 'Queso cheddar', singularName: 'Queso' },
      ],
    },
  ];
  for (const ing of ingredients) {
    await em.save(Ingredient, ing);
  }

  console.log('Seeding recipes...');
  await em.save(Recipe, {
    id: RECIPE_PANCAKES,
    difficulty: 1,
    time: 3600,
    portions: 4,
    visibility: 1,
    author: 'system',
    uniqueId: ulid(),
    publications: [
      {
        language: 'en',
        title: 'Classic Pancakes',
        description: 'Fluffy homemade pancakes',
      },
      {
        language: 'es',
        title: 'Panqueques clasicos',
        description: 'Panqueques caseros esponjosos',
      },
    ],
    steps: [
      {
        number: 1,
        content: [
          { language: 'en', title: 'Mix', body: '<p>Mix all ingredients</p>' },
          {
            language: 'es',
            title: 'Mezclar',
            body: '<p>Mezcla todos los ingredientes</p>',
          },
        ],
      },
    ],
    ingredients: [],
    kitchenware: [],
    categoryIds: [CAT_BREAKFAST],
  });

  await em.save(Recipe, {
    id: RECIPE_CHOCOLATE_CAKE,
    difficulty: 3,
    time: 3600,
    portions: 8,
    visibility: 1,
    author: 'system',
    uniqueId: ulid(),
    publications: [
      {
        language: 'en',
        title: 'Chocolate Cake',
        description: 'Rich chocolate cake',
      },
      {
        language: 'es',
        title: 'Pastel de chocolate',
        description: 'Pastel de chocolate rico',
      },
    ],
    steps: [
      {
        number: 1,
        content: [
          {
            language: 'en',
            title: 'Bake',
            body: '<p>Bake at 350F for 30 minutes.</p>',
          },
          {
            language: 'es',
            title: 'Hornear',
            body: '<p>Hornear a 180C por 30 minutos.</p>',
          },
        ],
      },
    ],
    ingredients: [],
    kitchenware: [],
    categoryIds: [CAT_DESSERT],
  });

  await em.save(Recipe, {
    id: RECIPE_SPAGHETTI_CARBONARA,
    difficulty: 2,
    time: 1800,
    portions: 4,
    visibility: 1,
    author: 'system',
    uniqueId: ulid(),
    publications: [
      {
        language: 'en',
        title: 'Spaghetti Carbonara',
        description: 'Classic Italian pasta with eggs and cheese',
      },
      {
        language: 'es',
        title: 'Spaghetti Carbonara',
        description: 'Pasta italiana clasica con huevos y queso',
      },
    ],
    steps: [
      {
        number: 1,
        content: [
          {
            language: 'en',
            title: 'Cook pasta',
            body: '<p>Boil spaghetti in salted water</p>',
          },
          {
            language: 'es',
            title: 'Cocinar pasta',
            body: '<p>Hierve la spaghetti en agua con sal</p>',
          },
        ],
      },
      {
        number: 2,
        content: [
          {
            language: 'en',
            title: 'Prepare sauce',
            body: '<p>Mix eggs with parmesan</p>',
          },
          {
            language: 'es',
            title: 'Preparar salsa',
            body: '<p>Mezcla los huevos con parmesano</p>',
          },
        ],
      },
    ],
    ingredients: [],
    kitchenware: [],
    categoryIds: [CAT_DINNER],
  });

  await em.save(Recipe, {
    id: RECIPE_CAESAR_SALAD,
    difficulty: 1,
    time: 900,
    portions: 2,
    visibility: 1,
    author: 'system',
    uniqueId: ulid(),
    publications: [
      {
        language: 'en',
        title: 'Caesar Salad',
        description: 'Fresh romaine lettuce with caesar dressing',
      },
      {
        language: 'es',
        title: 'Ensalada Caesar',
        description: 'Lechuga romana fresca con aderezo cesar',
      },
    ],
    steps: [
      {
        number: 1,
        content: [
          {
            language: 'en',
            title: 'Prepare',
            body: '<p>Wash and chop lettuce</p>',
          },
          {
            language: 'es',
            title: 'Preparar',
            body: '<p>Lava y pica la lechuga</p>',
          },
        ],
      },
    ],
    ingredients: [],
    kitchenware: [],
    categoryIds: [CAT_LUNCH],
  });

  await em.save(Recipe, {
    id: RECIPE_BEEF_TACOS,
    difficulty: 2,
    time: 1200,
    portions: 4,
    visibility: 1,
    author: 'system',
    uniqueId: ulid(),
    publications: [
      {
        language: 'en',
        title: 'Beef Tacos',
        description: 'Seasoned ground beef in corn tortillas',
      },
      {
        language: 'es',
        title: 'Tacos de carne',
        description: 'Carne molida sazonada en tortillas de maiz',
      },
    ],
    steps: [
      {
        number: 1,
        content: [
          {
            language: 'en',
            title: 'Cook meat',
            body: '<p>Brown the ground beef with spices</p>',
          },
          {
            language: 'es',
            title: 'Cocinar carne',
            body: '<p>Dora la carne molida con especias</p>',
          },
        ],
      },
    ],
    ingredients: [],
    kitchenware: [],
    categoryIds: [CAT_DINNER],
  });

  await em.save(Recipe, {
    id: RECIPE_BERRY_SMOOTHIE,
    difficulty: 1,
    time: 600,
    portions: 2,
    visibility: 1,
    author: 'system',
    uniqueId: ulid(),
    publications: [
      {
        language: 'en',
        title: 'Berry Smoothie',
        description: 'Refreshing mixed berry smoothie',
      },
      {
        language: 'es',
        title: 'Batido de frutas del bosque',
        description: 'Refrescante batido de frutas mixtas',
      },
    ],
    steps: [
      {
        number: 1,
        content: [
          {
            language: 'en',
            title: 'Blend',
            body: '<p>Blend all ingredients until smooth</p>',
          },
          {
            language: 'es',
            title: 'Licuar',
            body: '<p>Licua todos los ingredientes hasta que queden suaves</p>',
          },
        ],
      },
    ],
    ingredients: [],
    kitchenware: [],
    categoryIds: [CAT_BREAKFAST],
  });

  await em.save(Recipe, {
    id: RECIPE_GRILLED_SALMON,
    difficulty: 3,
    time: 35,
    portions: 2,
    visibility: 1,
    author: 'system',
    uniqueId: ulid(),
    publications: [
      {
        language: 'en',
        title: 'Grilled Salmon',
        description: 'Perfectly grilled salmon with herbs',
      },
      {
        language: 'es',
        title: 'Salmon a la parrilla',
        description: 'Salmon perfectamente Parrillado con hierbas',
      },
    ],
    steps: [
      {
        number: 1,
        content: [
          {
            language: 'en',
            title: 'Season',
            body: '<p>Season salmon with olive oil and herbs</p>',
          },
          {
            language: 'es',
            title: 'Sazonar',
            body: '<p>Sazona el salmon con aceite de oliva y hierbas</p>',
          },
        ],
      },
      {
        number: 2,
        content: [
          {
            language: 'en',
            title: 'Grill',
            body: '<p>Grill for 10-12 minutes per side</p>',
          },
          {
            language: 'es',
            title: 'Parrillar',
            body: '<p>Parrilla durante 10-12 minutos por lado</p>',
          },
        ],
      },
    ],
    ingredients: [],
    kitchenware: [],
    categoryIds: [CAT_DINNER],
  });

  await em.save(Recipe, {
    id: RECIPE_CHOCOLATE_MOUSSE,
    difficulty: 2,
    time: 45,
    portions: 6,
    visibility: 1,
    author: 'system',
    uniqueId: ulid(),
    publications: [
      {
        language: 'en',
        title: 'Chocolate Mousse',
        description: 'Rich and creamy chocolate dessert',
      },
      {
        language: 'es',
        title: 'Mousse de chocolate',
        description: 'Postre de chocolate rico y cremoso',
      },
    ],
    steps: [
      {
        number: 1,
        content: [
          {
            language: 'en',
            title: 'Melt',
            body: '<p>Melt chocolate in a double boiler</p>',
          },
          {
            language: 'es',
            title: 'Derretir',
            body: '<p>Derrita el chocolate a banho maria</p>',
          },
        ],
      },
      {
        number: 2,
        content: [
          {
            language: 'en',
            title: 'Whip',
            body: '<p>Whip cream and fold in chocolate</p>',
          },
          {
            language: 'es',
            title: 'Batir',
            body: '<p>Bate la crema y mezcla con el chocolate</p>',
          },
        ],
      },
    ],
    ingredients: [],
    kitchenware: [],
    categoryIds: [CAT_DESSERT],
  });

  await em.save(Recipe, {
    id: RECIPE_VEGGIE_STIR_FRY,
    difficulty: 1,
    time: 20,
    portions: 3,
    visibility: 1,
    author: 'system',
    uniqueId: ulid(),
    publications: [
      {
        language: 'en',
        title: 'Vegetable Stir Fry',
        description: 'Colorful mixed vegetables in soy sauce',
      },
      {
        language: 'es',
        title: 'Salteado de verduras',
        description: 'Verduras mixtas coloridas en salsa de soja',
      },
    ],
    steps: [
      {
        number: 1,
        content: [
          {
            language: 'en',
            title: 'Stir fry',
            body: '<p>Stir fry vegetables on high heat</p>',
          },
          {
            language: 'es',
            title: 'Saltear',
            body: '<p>Saltea las verduras a fuego alto</p>',
          },
        ],
      },
    ],
    ingredients: [],
    kitchenware: [],
    categoryIds: [CAT_LUNCH],
  });

  await em.save(Recipe, {
    id: RECIPE_FRENCH_TOAST,
    difficulty: 1,
    time: 15,
    portions: 2,
    visibility: 1,
    author: 'system',
    uniqueId: ulid(),
    publications: [
      {
        language: 'en',
        title: 'French Toast',
        description: 'Classic breakfast with cinnamon and vanilla',
      },
      {
        language: 'es',
        title: 'Tostada francesa',
        description: 'Desayuno clasico con vainilla ycanela',
      },
    ],
    steps: [
      {
        number: 1,
        content: [
          {
            language: 'en',
            title: 'Dip',
            body: '<p>Dip bread in egg mixture</p>',
          },
          {
            language: 'es',
            title: 'Remojar',
            body: '<p>Remoja el pan en la mezcla de huevos</p>',
          },
        ],
      },
      {
        number: 2,
        content: [
          {
            language: 'en',
            title: 'Cook',
            body: '<p>Cook until golden brown</p>',
          },
          {
            language: 'es',
            title: 'Cocinar',
            body: '<p>Cocina hasta que dore</p>',
          },
        ],
      },
    ],
    ingredients: [],
    kitchenware: [],
    categoryIds: [CAT_BREAKFAST],
  });

  await em.save(Recipe, {
    id: RECIPE_SHRIMP_PAELLA,
    difficulty: 3,
    time: 60,
    portions: 4,
    visibility: 1,
    author: 'system',
    uniqueId: ulid(),
    publications: [
      {
        language: 'en',
        title: 'Shrimp Paella',
        description: 'Traditional Spanish rice dish with seafood',
      },
      {
        language: 'es',
        title: 'Paella de gambas',
        description: 'Plato arroz tradicional espanol con mariscos',
      },
    ],
    steps: [
      {
        number: 1,
        content: [
          {
            language: 'en',
            title: 'Sauté',
            body: '<p>Sauté vegetables and shrimp</p>',
          },
          {
            language: 'es',
            title: 'Sofreir',
            body: '<p>Saltea las verduras y las gambas</p>',
          },
        ],
      },
      {
        number: 2,
        content: [
          {
            language: 'en',
            title: 'Cook rice',
            body: '<p>Add rice and let simmer</p>',
          },
          {
            language: 'es',
            title: 'Cocinar arroz',
            body: '<p>Anade el arroz y deja hervir</p>',
          },
        ],
      },
    ],
    ingredients: [],
    kitchenware: [],
    categoryIds: [CAT_DINNER],
  });

  await em.save(Recipe, {
    id: RECIPE_LEMON_CHEESECAKE,
    difficulty: 3,
    time: 90,
    portions: 8,
    visibility: 1,
    author: 'system',
    uniqueId: ulid(),
    publications: [
      {
        language: 'en',
        title: 'Lemon Cheesecake',
        description: 'Creamy cheesecake with tangy lemon',
      },
      {
        language: 'es',
        title: 'Cheesecake de limon',
        description: 'Cheesecake cremoso con limon',
      },
    ],
    steps: [
      {
        number: 1,
        content: [
          {
            language: 'en',
            title: 'Bake crust',
            body: '<p>Bake cookie crust for 10 minutes</p>',
          },
          {
            language: 'es',
            title: 'Hornear base',
            body: '<p>Hornea la base de galletas por 10 minutos</p>',
          },
        ],
      },
      {
        number: 2,
        content: [
          {
            language: 'en',
            title: 'Mix',
            body: '<p>Mix cream cheese and lemon</p>',
          },
          {
            language: 'es',
            title: 'Mezclar',
            body: '<p>Mezcla el queso crema con limon</p>',
          },
        ],
      },
    ],
    ingredients: [],
    kitchenware: [],
    categoryIds: [CAT_DESSERT],
  });

  await em.save(Recipe, {
    id: RECIPE_AVOCADO_TOAST,
    difficulty: 1,
    time: 10,
    portions: 2,
    visibility: 1,
    author: 'system',
    uniqueId: ulid(),
    publications: [
      {
        language: 'en',
        title: 'Avocado Toast',
        description: 'Trendy breakfast with mashed avocado',
      },
      {
        language: 'es',
        title: 'Tostada de aguacate',
        description: 'Desayuno tendencia con aguacate machacado',
      },
    ],
    steps: [
      {
        number: 1,
        content: [
          {
            language: 'en',
            title: 'Spread',
            body: '<p>Mash avocado and spread on toast</p>',
          },
          {
            language: 'es',
            title: 'Untar',
            body: '<p>Macha el aguacate y unta en el pan</p>',
          },
        ],
      },
    ],
    ingredients: [],
    kitchenware: [],
    categoryIds: [CAT_BREAKFAST],
  });

  await dataSource.destroy();
  console.log('Seeding complete!');
}

seed().catch(console.error);
