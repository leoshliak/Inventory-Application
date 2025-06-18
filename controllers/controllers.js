const db = require('../db/queries');
const { body, validationResult } = require('express-validator');

const categoryValidation = [
  body('title').notEmpty().withMessage('Category name is required'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters')
]

function renderWithLayout(res, view, options = {}) {
  res.render(view, options, (err, html) => {
    if (err) throw err;
    res.render('layout', { ...options, body: html });
  });
}

exports.getHomePage = (req, res) => {
    renderWithLayout(res, 'pages/home', { title: 'Home' });
}

exports.getAllGames = (req, res) => {
    renderWithLayout(res, 'pages/games', { title: 'Games' });
}

exports.getAllCategories = async (req, res) => {
  const categories = await db.getAllCategories();
  renderWithLayout(res, 'pages/categories', {title: 'Categories', categories: Object.values(categories)});
}

exports.getAddCategory = (req, res) => {
    renderWithLayout(res, 'pages/addCategory', { title: 'Add Category' });
}

exports.createCategory = [
  categoryValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('pages/addCategory', {
        title: 'Add Category',
        errors: errors.array(),
      });
    }

  const { title, description } = req.body;
  const imageFile = req.file;

  await db.insertCategory({title, description, image: imageFile ? imageFile.filename : '/placeholder.png'})
  res.redirect('/categories');
  }

]