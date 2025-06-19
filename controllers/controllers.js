const db = require('../db/queries');
const { body, validationResult } = require('express-validator');

const categoryValidation = [
  body('title').notEmpty().withMessage('Category name is required'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters')
]

const gameValidation = [
  body('title').notEmpty().withMessage('Game title is required'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('category').notEmpty().withMessage('Category is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('release_date').isDate().withMessage('Release date must be a valid date'),
  body('rating').isFloat({ min: 0, max: 10 }).withMessage('Rating must be between 0 and 10'),
  body('publisher').optional().isLength({ max: 100 }).withMessage('Publisher name must be less than 100 characters')
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

exports.getAllGames = async (req, res) => {
    const games = await db.getAllGames();
    renderWithLayout(res, 'pages/games', { title: 'Games', games });
}

exports.getAddGame = async (req, res) => {
    const categories = await db.getAllCategories()
    renderWithLayout(res, 'pages/addGame', { title: 'Add Game', categories: Object.values(categories) });
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

  await db.insertCategory({title, description, image: imageFile ? imageFile.filename : 'placeholder.png'})
  res.redirect('/categories');
  }
]

exports.postAddGame = [
  gameValidation,

  async (req, res) => {
   const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('pages/addCategory', {
        title: 'Add Game',
        errors: errors.array(),
      });
    }
    const { title, description, category, price, release_date, rating, publisher } = req.body;
    const logoFile = req.files.logo ? req.files.logo[0] : 'placeholder-icon.jpg';
    const heroImageFile = req.files.hero_image ? req.files.hero_image[0] : 'placeholder.png';

    await db.insertGame({title, description, category, price, release_date, rating, 
      publisher, logo: logoFile.filename, hero_image: heroImageFile.filename});
     /* console.log({
        title, description, category, price, release_date, rating, publisher,
        logo: logoFile.filename,
        hero_image: heroImageFile.filename
      });*/
    res.redirect('/games');
  }
]