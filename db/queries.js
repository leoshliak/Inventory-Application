const pool = require('./pool');

async function getAllGames() {
    const { rows } = await pool.query("SELECT * FROM games ");
    return rows;
}

async function getAllCategories() {
    const { rows } = await pool.query("SELECT * FROM categories");
    return rows;
}

async function insertGame(game) {
  const query = `
    INSERT INTO games (title, description, category, price, logo, hero_image)
    VALUES ($1, $2, $3, $4, $5, $6)
  `;
  const values = [
    game.title,
    game.description,
    game.category,
    game.price,
    game.logo,
    game.hero_image
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

module.exports = {
    getAllGames,
    getAllCategories,
    insertGame,
    insertCategory

}