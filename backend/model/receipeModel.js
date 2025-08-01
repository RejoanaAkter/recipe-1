
import mongoose from "mongoose"

const recipeSchema = new mongoose.Schema({
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
        title: String,
        description: String,
        ingredients: [String],
        instructions: [String], 
          tags: [String],
        cuisine:String,
        prepTime:Number,
        imageUrl: String,
        isPublic: Boolean
});

const Recipe = mongoose.model('Recipes', recipeSchema);
export default Recipe;