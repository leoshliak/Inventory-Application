const express = require('express');
const router = express.Router();
const controllers = require('../controllers/controllers');
const upload = require('../controllers/multer');

router.get('/', controllers.getHomePage);

router.get('/games', controllers.getAllGames);

router.get('/addCategory', controllers.getAddCategory);

router.get('/categories', controllers.getAllCategories);

router.post('/addCategory', upload.single('image'), controllers.createCategory);

module.exports = router;