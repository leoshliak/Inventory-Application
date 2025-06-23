const pool = require('./pool');

async function getAllGames() {
    const { rows } = await pool.query("SELECT * FROM games ");
    return rows;
}

async function getGameById(id) {
  const query = "SELECT * FROM games WHERE id = $1"
  const game = await pool.query(query, [id]);
  if (game.rows.length === 0) {
    throw new Error(`Game with id ${id} not found`);
  }
  return game.rows[0];
}

async function getAllGamesByCategory(title) {
  const query = `
   SELECT * FROM GAMES
   WHERE category = $1
   ORDER BY title ASC
  `;
  const { rows } = await pool.query(query, [title]);
  return rows;
}

async function getAllCategories() {
    const { rows } = await pool.query("SELECT * FROM categories");
    return rows;
}

async function getCategoryById(id) {
  const query = "SELECT * FROM categories WHERE id = $1"
  const category = await pool.query(query, [id]);
  if (category.rows.length === 0) {
    throw new Error(`Category with id ${id} not found`);
  }
  return category.rows[0];
}

async function insertGame(game) {
  const query = `
    INSERT INTO games (title, description, category, price, logo, hero_image, release_date, rating, publisher)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  `;
  const values = [
    game.title,
    game.description,
    game.category,
    game.price,
    game.logo,
    game.hero_image,
    game.release_date,
    game.rating,
    game.publisher
  ];

  await pool.query(query, values);
}

async function insertCategory(category) {
  const query = `
    INSERT INTO categories (title, description, image)
    VALUES ($1, $2, $3)
  `;
  const values = [
    category.title,
    category.description,
    category.image
  ];

  await pool.query(query, values);
};

async function deleteGame(id) {
  await pool.query("DELETE FROM games WHERE id = $1", [id]);
}

async function updateGame(id, game) {
  const query = `
  UPDATE games 
  SET title = $1, description = $2, category = $3, price = $4, logo = $5, hero_image = $6, release_date = $7,rating = $8, publisher = $9
  WHERE id = $10
  `;
  const values = [
    game.title,
    game.description,
    game.category,
    game.price,
    game.logo,
    game.hero_image,
    game.release_date,
    game.rating,
    game.publisher,
    id
  ];

  await pool.query(query, values);
}

async function updateCategory(id, category) {
  const query = `
  UPDATE categories
  SET title = $1, description = $2, image = $3
  WHERE id = $4
  `;
  const values = [category.title, category.description, category.image, id]

  await pool.query(query, values);
}

module.exports = {
    getAllGames,
    getAllCategories,
    insertGame,
    insertCategory,
    getGameById,
    getCategoryById,
    getAllGamesByCategory,
    deleteGame,
    updateGame,
    updateCategory
}