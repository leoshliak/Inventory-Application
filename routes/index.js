const express = require('express');
const router = express.Router();
const controllers = require('../controllers/controllers');
const { categoryImage } = require('../controllers/multer');
const { gameImages } = require('../controllers/multer')

router.get('/', controllers.getHomePage);

router.get('/games', controllers.getAllGames);

router.get('/addGame', controllers.getAddGame);

router.post('/addGame', gameImages ,controllers.postAddGame);

router.get('/addCategory', controllers.getAddCategory);

router.get('/categories', controllers.getAllCategories);

router.post('/addCategory', categoryImage, controllers.createCategory);

module.exports = router;