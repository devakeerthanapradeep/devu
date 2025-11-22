import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Recipe from './models/Recipe.js';
import User from './models/User.js';

dotenv.config();

const sampleRecipes = [
  {
    title: "Classic Margherita Pizza",
    description: "Traditional Italian pizza with fresh mozzarella, tomatoes, and basil",
    ingredients: [
      { name: "pizza dough", quantity: "1", unit: "pound" },
      { name: "tomato sauce", quantity: "1", unit: "cup" },
      { name: "fresh mozzarella", quantity: "8", unit: "oz" },
      { name: "fresh basil", quantity: "10", unit: "leaves" },
      { name: "olive oil", quantity: "2", unit: "tbsp" },
      { name: "salt", quantity: "1", unit: "tsp" }
    ],
    instructions: "1. Preheat oven to 475°F (245°C).\n2. Roll out pizza dough on a floured surface.\n3. Spread tomato sauce evenly over the dough.\n4. Tear mozzarella into chunks and distribute over sauce.\n5. Drizzle with olive oil and sprinkle with salt.\n6. Bake for 12-15 minutes until crust is golden.\n7. Top with fresh basil leaves before serving.",
    prepTime: 20,
    cookTime: 15,
    servings: 4,
    difficulty: "Easy",
    categories: ["Italian", "Pizza", "Vegetarian"],
    imageUrl: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800"
  },
  {
    title: "Chicken Tikka Masala",
    description: "Creamy and aromatic Indian curry with tender chicken pieces",
    ingredients: [
      { name: "chicken breast", quantity: "2", unit: "pounds" },
      { name: "yogurt", quantity: "1", unit: "cup" },
      { name: "heavy cream", quantity: "1", unit: "cup" },
      { name: "tomato puree", quantity: "1", unit: "can" },
      { name: "garam masala", quantity: "2", unit: "tbsp" },
      { name: "ginger garlic paste", quantity: "3", unit: "tbsp" },
      { name: "onion", quantity: "2", unit: "medium" },
      { name: "butter", quantity: "4", unit: "tbsp" }
    ],
    instructions: "1. Marinate chicken in yogurt and spices for 2 hours.\n2. Grill or pan-fry chicken until cooked through.\n3. In a pan, sauté onions in butter until golden.\n4. Add ginger-garlic paste and cook for 2 minutes.\n5. Add tomato puree and spices, cook for 10 minutes.\n6. Add cream and simmer for 5 minutes.\n7. Add cooked chicken and simmer for 10 minutes.\n8. Garnish with cilantro and serve with rice or naan.",
    prepTime: 140,
    cookTime: 30,
    servings: 6,
    difficulty: "Medium",
    categories: ["Indian", "Curry", "Chicken"],
    imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800"
  },
  {
    title: "Japanese Ramen Bowl",
    description: "Rich and flavorful ramen with soft-boiled eggs and fresh toppings",
    ingredients: [
      { name: "ramen noodles", quantity: "4", unit: "portions" },
      { name: "pork belly", quantity: "1", unit: "pound" },
      { name: "chicken broth", quantity: "8", unit: "cups" },
      { name: "soy sauce", quantity: "4", unit: "tbsp" },
      { name: "miso paste", quantity: "2", unit: "tbsp" },
      { name: "soft-boiled eggs", quantity: "4", unit: "pieces" },
      { name: "green onions", quantity: "4", unit: "stalks" },
      { name: "nori sheets", quantity: "4", unit: "pieces" }
    ],
    instructions: "1. Prepare the broth by simmering chicken stock with soy sauce and miso.\n2. Cook pork belly until tender and slice thinly.\n3. Prepare soft-boiled eggs (6-7 minutes).\n4. Cook ramen noodles according to package instructions.\n5. Divide noodles among bowls.\n6. Pour hot broth over noodles.\n7. Top with sliced pork, halved eggs, green onions, and nori.\n8. Serve immediately while hot.",
    prepTime: 30,
    cookTime: 180,
    servings: 4,
    difficulty: "Hard",
    categories: ["Japanese", "Soup", "Noodles"],
    imageUrl: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=800"
  },
  {
    title: "Greek Moussaka",
    description: "Layered casserole with eggplant, meat sauce, and creamy béchamel",
    ingredients: [
      { name: "eggplant", quantity: "3", unit: "large" },
      { name: "ground lamb", quantity: "2", unit: "pounds" },
      { name: "onion", quantity: "2", unit: "medium" },
      { name: "tomato sauce", quantity: "2", unit: "cups" },
      { name: "milk", quantity: "3", unit: "cups" },
      { name: "flour", quantity: "4", unit: "tbsp" },
      { name: "butter", quantity: "4", unit: "tbsp" },
      { name: "parmesan cheese", quantity: "1", unit: "cup" }
    ],
    instructions: "1. Slice and salt eggplant, let drain for 30 minutes.\n2. Brown ground lamb with onions and tomato sauce.\n3. Make béchamel sauce with butter, flour, and milk.\n4. Layer fried eggplant slices in a baking dish.\n5. Add meat sauce layer.\n6. Top with béchamel sauce.\n7. Sprinkle with parmesan cheese.\n8. Bake at 350°F for 45 minutes until golden.",
    prepTime: 45,
    cookTime: 60,
    servings: 8,
    difficulty: "Medium",
    categories: ["Greek", "Casserole", "Lamb"],
    imageUrl: "https://images.unsplash.com/photo-1541010519337-1b4a7d0e5b0a?w=800"
  },
  {
    title: "Thai Green Curry",
    description: "Fragrant and spicy curry with coconut milk and fresh vegetables",
    ingredients: [
      { name: "green curry paste", quantity: "3", unit: "tbsp" },
      { name: "coconut milk", quantity: "2", unit: "cans" },
      { name: "chicken thigh", quantity: "1.5", unit: "pounds" },
      { name: "Thai eggplant", quantity: "4", unit: "pieces" },
      { name: "bamboo shoots", quantity: "1", unit: "cup" },
      { name: "Thai basil", quantity: "1", unit: "cup" },
      { name: "fish sauce", quantity: "2", unit: "tbsp" },
      { name: "palm sugar", quantity: "1", unit: "tbsp" }
    ],
    instructions: "1. Heat oil in a wok and fry curry paste until fragrant.\n2. Add thick coconut milk and cook until oil separates.\n3. Add chicken and cook until no longer pink.\n4. Add remaining coconut milk and bring to simmer.\n5. Add vegetables and cook until tender.\n6. Season with fish sauce and palm sugar.\n7. Add Thai basil just before serving.\n8. Serve with jasmine rice.",
    prepTime: 20,
    cookTime: 25,
    servings: 4,
    difficulty: "Easy",
    categories: ["Thai", "Curry", "Spicy"],
    imageUrl: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800"
  },
  {
    title: "Mexican Tacos al Pastor",
    description: "Marinated pork tacos with pineapple and traditional toppings",
    ingredients: [
      { name: "pork shoulder", quantity: "2", unit: "pounds" },
      { name: "corn tortillas", quantity: "12", unit: "pieces" },
      { name: "pineapple", quantity: "1", unit: "cup" },
      { name: "onion", quantity: "1", unit: "medium" },
      { name: "cilantro", quantity: "1", unit: "bunch" },
      { name: "lime", quantity: "4", unit: "pieces" },
      { name: "achiote paste", quantity: "2", unit: "tbsp" },
      { name: "orange juice", quantity: "1", unit: "cup" }
    ],
    instructions: "1. Marinate pork in achiote paste and orange juice overnight.\n2. Grill or roast pork until charred and cooked through.\n3. Slice pork thinly.\n4. Grill pineapple slices until caramelized.\n5. Warm corn tortillas on a griddle.\n6. Fill tortillas with pork and pineapple.\n7. Top with diced onion and cilantro.\n8. Serve with lime wedges.",
    prepTime: 480,
    cookTime: 120,
    servings: 6,
    difficulty: "Medium",
    categories: ["Mexican", "Tacos", "Pork"],
    imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800"
  },
  {
    title: "French Beef Bourguignon",
    description: "Classic French stew with tender beef in red wine sauce",
    ingredients: [
      { name: "beef chuck", quantity: "3", unit: "pounds" },
      { name: "red wine", quantity: "3", unit: "cups" },
      { name: "bacon", quantity: "6", unit: "slices" },
      { name: "pearl onions", quantity: "20", unit: "pieces" },
      { name: "mushrooms", quantity: "1", unit: "pound" },
      { name: "carrots", quantity: "4", unit: "medium" },
      { name: "beef stock", quantity: "2", unit: "cups" },
      { name: "thyme", quantity: "3", unit: "sprigs" }
    ],
    instructions: "1. Brown bacon and set aside.\n2. Brown beef cubes in bacon fat.\n3. Remove beef and sauté vegetables.\n4. Add wine and deglaze pan.\n5. Return beef to pot with stock and herbs.\n6. Simmer covered for 2 hours.\n7. Add pearl onions and mushrooms.\n8. Cook for 30 more minutes until tender.",
    prepTime: 30,
    cookTime: 180,
    servings: 6,
    difficulty: "Hard",
    categories: ["French", "Stew", "Beef"],
    imageUrl: "https://images.unsplash.com/photo-1608039755401-742074f0548d?w=800"
  },
  {
    title: "Sushi Rolls",
    description: "Fresh California and salmon rolls with wasabi and ginger",
    ingredients: [
      { name: "sushi rice", quantity: "3", unit: "cups" },
      { name: "nori sheets", quantity: "10", unit: "pieces" },
      { name: "salmon", quantity: "8", unit: "oz" },
      { name: "avocado", quantity: "2", unit: "pieces" },
      { name: "cucumber", quantity: "1", unit: "medium" },
      { name: "crab sticks", quantity: "8", unit: "pieces" },
      { name: "rice vinegar", quantity: "3", unit: "tbsp" },
      { name: "sesame seeds", quantity: "2", unit: "tbsp" }
    ],
    instructions: "1. Cook sushi rice and season with rice vinegar.\n2. Place nori on bamboo mat.\n3. Spread thin layer of rice on nori.\n4. Add fillings in a line across the center.\n5. Roll tightly using the mat.\n6. Seal edge with water.\n7. Cut into 6-8 pieces with sharp knife.\n8. Serve with soy sauce, wasabi, and pickled ginger.",
    prepTime: 45,
    cookTime: 20,
    servings: 4,
    difficulty: "Medium",
    categories: ["Japanese", "Sushi", "Seafood"],
    imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800"
  },
  {
    title: "Spanish Paella",
    description: "Traditional Spanish rice dish with seafood and saffron",
    ingredients: [
      { name: "paella rice", quantity: "2", unit: "cups" },
      { name: "shrimp", quantity: "1", unit: "pound" },
      { name: "mussels", quantity: "1", unit: "pound" },
      { name: "chicken thighs", quantity: "4", unit: "pieces" },
      { name: "saffron", quantity: "1", unit: "tsp" },
      { name: "bell peppers", quantity: "2", unit: "medium" },
      { name: "peas", quantity: "1", unit: "cup" },
      { name: "chicken stock", quantity: "4", unit: "cups" }
    ],
    instructions: "1. Heat olive oil in a paella pan.\n2. Brown chicken pieces and set aside.\n3. Sauté vegetables in the same pan.\n4. Add rice and toast for 2 minutes.\n5. Add hot stock infused with saffron.\n6. Arrange chicken and seafood on top.\n7. Simmer without stirring for 20 minutes.\n8. Let rest for 5 minutes before serving.",
    prepTime: 30,
    cookTime: 40,
    servings: 6,
    difficulty: "Medium",
    categories: ["Spanish", "Rice", "Seafood"],
    imageUrl: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=800"
  },
  {
    title: "Chocolate Lava Cake",
    description: "Decadent chocolate cake with molten center",
    ingredients: [
      { name: "dark chocolate", quantity: "6", unit: "oz" },
      { name: "butter", quantity: "6", unit: "tbsp" },
      { name: "eggs", quantity: "2", unit: "large" },
      { name: "egg yolks", quantity: "2", unit: "pieces" },
      { name: "sugar", quantity: "1/4", unit: "cup" },
      { name: "flour", quantity: "2", unit: "tbsp" },
      { name: "vanilla extract", quantity: "1", unit: "tsp" },
      { name: "powdered sugar", quantity: "2", unit: "tbsp" }
    ],
    instructions: "1. Preheat oven to 425°F (220°C).\n2. Melt chocolate and butter together.\n3. Whisk eggs, egg yolks, and sugar until thick.\n4. Add melted chocolate mixture.\n5. Fold in flour and vanilla.\n6. Pour into greased ramekins.\n7. Bake for 12-14 minutes until edges are firm.\n8. Invert onto plates and dust with powdered sugar.",
    prepTime: 15,
    cookTime: 14,
    servings: 4,
    difficulty: "Easy",
    categories: ["Dessert", "Chocolate", "French"],
    imageUrl: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800"
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/recipe-share');
    console.log('Connected to MongoDB');

    // Find a user to assign recipes to (or create one)
    let user = await User.findOne();
    
    if (!user) {
      // Create a default user if none exists
      user = await User.create({
        fullName: 'Admin User',
        email: 'admin@recipeapp.com',
        password: 'admin123', // This should be hashed in production
      });
      console.log('Created default user');
    }

    // Clear existing recipes (optional - comment out if you want to keep existing)
    // await Recipe.deleteMany({});
    // console.log('Cleared existing recipes');

    // Add user ID to each recipe
    const recipesWithUser = sampleRecipes.map(recipe => ({
      ...recipe,
      user: user._id,
      ratings: [],
      numReviews: 0,
      averageRating: 0
    }));

    // Insert recipes
    const createdRecipes = await Recipe.insertMany(recipesWithUser);
    console.log(`Successfully added ${createdRecipes.length} recipes to the database!`);

    // Log recipe titles
    console.log('\nAdded recipes:');
    createdRecipes.forEach((recipe, index) => {
      console.log(`${index + 1}. ${recipe.title}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
