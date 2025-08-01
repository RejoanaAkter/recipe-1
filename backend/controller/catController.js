import Category from '../model/catModel.js';

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !imageUrl) {
      return res.status(400).json({ message: 'Both name and image are required' });
    }

    if (!/\.(jpg|jpeg|png)$/i.test(req.file.originalname)) {
      return res.status(400).json({ message: 'Only JPG or PNG images allowed' });
    }

    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({ name, imageUrl });
    const saved = await category.save();

    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 }); // alphabetically
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
