const express = require('express');
const router = express.Router();
const controllers = require('../controllers/controllers');
const { categoryImage } = require('../controllers/multer');
const { gameImages } = require('../controllers/multer')

router.get('/', controllers.getHomePage);

router.get('/games', controllers.getAllGames);

router.get('/addGame', controllers.getAddGame);

router.post('/addGame', gameImages ,controllers.postAddGame);

router.get('/games/:id', controllers.getGameDetails);

router.delete('/games/:id', controllers.deleteGame);

router.get('/games/edit/:id', controllers.editGameForm);

router.put('/games/edit/:id', gameImages, controllers.updateGamePut);

router.get('/addCategory', controllers.getAddCategory);

router.get('/categories', controllers.getAllCategories);

router.get('/categories/:id', controllers.getCategoryDetails);

router.post('/addCategory', categoryImage, controllers.createCategory);

router.get('/categories/edit/:id', controllers.editCategoryForm);

router.put('/categories/edit/:id', categoryImage, controllers.updateCategoryPut);

router.delete('/categories/:id', controllers.deleteCategory);

router.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).send('DB CONNECTED!');
  } catch (error) {
    res.status(500).send(`DB ERROR: ${error.message}`);
  }
});

module.exports = router;