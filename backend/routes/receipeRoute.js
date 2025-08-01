import express from 'express';
import { createRecipe, getAllRecipes, getRecipeById, updateRecipe, deleteRecipe, getPublicRecipes, getUserWithRecipes, getRecipesByCategory, getRecipesByName } from '../controller/receipeController.js';
import { upload } from '../middleware/multer.js';

const receipeRoute = express.Router();  // <--- you must have this line
// receipeRoute.post('/recipe', upload.single('image'), createRecipe);

receipeRoute.post('/recipe', upload.single('image'), createRecipe);
receipeRoute.get('/recipes', getAllRecipes);
receipeRoute.get('/recipes/public', getPublicRecipes);
receipeRoute.get('/recipe/search', getRecipesByName);
receipeRoute.get('/recipe/:id', getRecipeById);
receipeRoute.put('/update/recipe/:id', updateRecipe);
receipeRoute.delete('/delete/recipe/:id', deleteRecipe);
receipeRoute.get('/user/:userId', getUserWithRecipes);
receipeRoute.get('/category/:categoryId', getRecipesByCategory);


export default receipeRoute;
