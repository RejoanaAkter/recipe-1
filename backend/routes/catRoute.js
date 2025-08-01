import express from 'express';
import { createCategory, getAllCategories } from '../controller/catController.js';
import { upload } from "../middleware/multer.js";

const catRoute = express.Router();


catRoute.post('/category', upload.single('image'), createCategory);
catRoute.get('/categories', getAllCategories);

export default catRoute;