const db = require('../db/queries');
const { body, validationResult } = require('express-validator');
const { renderWithLayout, deleteImage } = require('../utils');

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
  const unknown = categories.find(cat => cat.title === 'Unknown category');
  const rest = categories.filter(cat => cat.title !== 'Unknown category');
  const sortedCategories = unknown ? [...rest, unknown] : categories;
  renderWithLayout(res, 'pages/categories', { title: 'Categories', categories: sortedCategories });
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
      return res.status(400).render('pages/addGame', {
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

exports.getGameDetails = async (req, res) => {
  const gameId = req.params.id;
  const game = await db.getGameById(gameId);

  if (!game) {
    return res.status(404).render('pages/error', { title: 'Game Not Found', message: 'The requested game does not exist.' });
  }
  
  renderWithLayout(res, 'pages/gameDetails', { title: game.title, game: game});
}

exports.getCategoryDetails = async (req, res) => {
  const categoryId = req.params.id;
  const category = await db.getCategoryById(categoryId);

  if (!category) {
    return res.status(404).render('pages/error', { title: 'Category Not Found', message: 'The requested category does not exist.' });
  }

  const games = await db.getAllGamesByCategory(category.title)

  renderWithLayout(res, 'pages/categoryDetails', { title: category.title, category: category, games: Object.values(games) });
}

exports.deleteGame = async (req, res) => {
  const gameId = req.params.id;
  const game = await db.getGameById(gameId);

  if (!game) return res.status(404).send('Game not found');
  await db.deleteGame(gameId);

  if (game.logo) deleteImage(`/uploads/${game.logo}`);
  if (game.hero_image) deleteImage(`/uploads/${game.hero_image}`);
  res.redirect('/games');
}

exports.editGameForm = async (req, res) => {
  const gameId = req.params.id;
  const game = await db.getGameById(gameId);
  const categories = await db.getAllCategories();

  if (!game) {
    return res.status(404).render('pages/error', { title: 'Game Not Found', message: 'The requested game does not exist.' });
  }

  renderWithLayout(res, 'pages/editGame', { title: 'Edit Game', game, categories: Object.values(categories) });
}

exports.updateGamePut = [
  gameValidation,
  async (req, res) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('pages/editGame', {
        title: 'Edit Game',
        errors: errors.array(),
      });
    }

    const gameId = req.params.id;
    const { title, description, category, price, release_date, rating, publisher } = req.body;
    const prevGame = await db.getGameById(gameId);
    const logoFile = req.files.logo;
    const heroImageFile = req.files.hero_image;

    if (logoFile) {
      deleteImage(`/uploads/${prevGame.logo}`);
    }

    if (heroImageFile) {
      deleteImage(`/uploads/${prevGame.hero_image}`);
    }
   
    await db.updateGame(gameId, {
      title, description, category, price, release_date, rating, publisher,
      logo: logoFile ? logoFile.filename : prevGame.logo,
      hero_image: heroImageFile ? heroImageFile.filename : prevGame.hero_image
    });

    res.redirect(`/games/${gameId}`);
  }
]

exports.editCategoryForm = async (req, res) => {
  const categoryId = req.params.id;
  const category = await db.getCategoryById(categoryId);

  if (!category) {
    return res.status(404).render('pages/error', { title: 'Category Not Found', message: 'The requested category does not exists. '});
  }

  renderWithLayout(res, 'pages/editCategory', { title: 'Edit Category', category });
}

exports.updateCategoryPut = [
  categoryValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('pages/editCategory', {
        title: 'Edit Category',
        errors: errors.array(),
      });
    }

    const categoryId = req.params.id;
    const { title, description } = req.body;
    const prevCategory = await db.getCategoryById(categoryId);
    const imageFile = req.file;

    if (imageFile) {
      deleteImage(`/uploads/${prevCategory.image}`);
    }

    await db.updateCategory(categoryId, { title, description,
      image: imageFile ? imageFile.filename : prevCategory.image
    })

    res.redirect(`/categories/${categoryId}`);
  }
]