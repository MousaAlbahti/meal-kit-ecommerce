const Category = require('../models/Category'); 

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const addCategory = async (req, res) => {
  try {
    const title = req.body.name; 
    if (!title) return res.status(400).json({ message: 'Category title is required' });

    const slug = title.toLowerCase().replace(/ /g, '-');
    const description = `Delicious meals in the ${title} category`; 

    const category = await Category.create({ title, slug, description });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const title = req.body.name;
    const slug = title.toLowerCase().replace(/ /g, '-');

    const category = await Category.findByIdAndUpdate(
      req.params.id, 
      { title, slug },
      { new: true } 
    );
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { getCategories, addCategory, updateCategory, deleteCategory };