const pool = require('../config/db');

async function getAllCategories() {
  const res = await pool.query('SELECT * FROM prata.categories ORDER BY id');
  return res.rows;
}

async function getCategoryById(id) {
  const res = await pool.query('SELECT * FROM prata.categories WHERE id = $1', [id]);
  return res.rows[0];
}

async function createCategory({ name, description }) {
  const res = await pool.query(
    'INSERT INTO prata.categories (name, description) VALUES ($1, $2) RETURNING *',
    [name, description]
  );
  return res.rows[0];
}

async function updateCategory(id, { name, description }) {
  const res = await pool.query(
    `
      UPDATE prata.categories
      SET
        name = COALESCE($1, name),
        description = COALESCE($2, description)
      WHERE id = $3
      RETURNING *;
    `,
    [name, description, id]
  );
  return res.rows[0];
}

async function deleteCategory(id) {
  const res = await pool.query(
    'DELETE FROM prata.categories WHERE id = $1 RETURNING id;',
    [id]
  );
  return res.rows[0];
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
