import Recipe from '../model/receipeModel.js'; // make sure filename is correct
import { cloudinaryUpload } from '../utils/cloudinary.js';

// Create recipe

export const createRecipe = async (req, res) => {
  try {
    const {
      user,
      category,
      title,
      description,
      ingredients,
      instructions,
      tags,
      cuisine,
      prepTime,
      isPublic,
    } = req.body;
    const parsedIngredients = JSON.parse(ingredients);
    const parsedInstructions = JSON.parse(instructions);
    const parsedTags = JSON.parse(tags);
    // If image uploaded via multer, get its path, else fallback to imageUrl from req.body (optional)
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl;

    // You can validate imageUrl extension here if needed
    if (imageUrl && !/\.(jpg|jpeg|png)$/i.test(imageUrl)) {
      return res.status(400).json({ message: 'Only JPG or PNG images allowed' });
    }

    const newRecipe = new Recipe({
      user,
      category,
      title,
      description,
      ingredients: parsedIngredients,
      instructions : parsedInstructions,
      tags: parsedTags,
      cuisine,
      prepTime,
      imageUrl,
      isPublic,
    });

    const savedRecipe = await newRecipe.save();

    const populatedRecipe = await Recipe.findById(savedRecipe._id)
      .populate('user')
      .populate('category');

    res.status(201).json(populatedRecipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get all recipes
export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .populate('user')        // Populate full user object
      .populate('category');   // Populate full category object

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get public recipes only
export const getPublicRecipes = async (req, res) => {
  try {
    const publicRecipes = await Recipe.find({ isPublic: true }).populate('user', 'name');
    res.status(200).json(publicRecipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get recipe by ID
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('user')
      .populate('category');

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
// Update recipe by ID
export const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const {
      title,
      description,
      ingredients,
      instructions,
      cuisine,
      prepTime,
      isPublic,
      imageUrl: bodyImageUrl,
    } = req.body;

    // Update image if file uploaded
    if (req.file) {
      const result = await cloudinaryUpload(req.file.path);
      recipe.imageUrl = result.secure_url;
    } else if (bodyImageUrl) {
      // Validate image URL extension
      if (!/\.(jpg|jpeg|png)$/i.test(bodyImageUrl)) {
        return res.status(400).json({ message: 'Only JPG or PNG images allowed for imageUrl' });
      }
      recipe.imageUrl = bodyImageUrl;
    }

    recipe.title = title || recipe.title;
    recipe.description = description || recipe.description;

    if (ingredients) {
      try {
        recipe.ingredients = typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients;
      } catch {
        return res.status(400).json({ error: 'Invalid format for ingredients' });
      }
    }

    if (instructions) {
      try {
        recipe.instructions = typeof instructions === 'string' ? JSON.parse(instructions) : instructions;
      } catch {
        return res.status(400).json({ error: 'Invalid format for instructions' });
      }
    }

    recipe.cuisine = cuisine || recipe.cuisine;

    if (prepTime !== undefined) {
      if (typeof prepTime !== 'number' || prepTime < 0) {
        return res.status(400).json({ message: 'prepTime must be a positive number' });
      }
      recipe.prepTime = prepTime;
    }

    recipe.isPublic = isPublic !== undefined ? isPublic : recipe.isPublic;

    const updatedRecipe = await recipe.save();
    res.status(200).json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Delete recipe
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    await recipe.deleteOne();
    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get all recipes created by a specific user
export const getUserWithRecipes = async (req, res) => {
  try {
    const { userId } = req.params;

    const recipes = await Recipe.find({ user: userId })
      .populate('user')
      .populate('category');

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const checkRecipeOwner = async (req, res) => {
  try {
    const { recipeId, name, password } = req.body;

    if (!recipeId || !name || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const recipe = await Recipe.findById(recipeId).populate("user");

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.user.name === name && recipe.user.password === password) {
      return res.status(200).json({ allowed: true });
    } else {
      return res.status(403).json({ allowed: false, message: "Name or password incorrect" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const getRecipesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Validate category ID
    if (!categoryId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    // Find recipes matching the category
    const recipes = await Recipe.find({ category: categoryId })
      .populate('user', 'name email')    // optional: include user fields
      .populate('category', 'name');     // optional: include category name only

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getRecipesByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ message: 'Recipe name is required for search.' });
    }

    const recipes = await Recipe.find({
      title: { $regex: name, $options: 'i' }
    })
      .populate('user', 'name email')
      .populate('category', 'name');

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

