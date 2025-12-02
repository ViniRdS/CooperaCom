const pool = require('../config/db');

async function createUser({ name, email, password_hash, bio = null, avatar = null }) {
  const q = `
    INSERT INTO prata.users (name, email, user_password, bio, avatar)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, created_at;
  `;
  const values = [name, email, password_hash, bio, avatar];
  const res = await pool.query(q, values);
  return res.rows[0];
}

async function findUserByEmail(email) {
  const res = await pool.query('SELECT * FROM prata.users WHERE email = $1', [email]);
  return res.rows[0];
}

async function findUserById(id) {
  const res = await pool.query(
    'SELECT id, name, email, bio, avatar, created_at FROM prata.users WHERE id = $1',
    [id]
  );
  return res.rows[0];
}

async function updateUser(id, { name, bio, avatar, password_hash }) {
  const q = `
    UPDATE prata.users
    SET 
      name = COALESCE($1, name),
      bio = COALESCE($2, bio),
      avatar = COALESCE($3, avatar),
      user_password = COALESCE($4, user_password),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $5
    RETURNING id, name, email, bio, avatar, created_at;
  `;
  const values = [name, bio, avatar, password_hash, id];
  const res = await pool.query(q, values);
  return res.rows[0];
}

async function deleteUser(id) {
  const res = await pool.query('DELETE FROM prata.users WHERE id = $1 RETURNING id;', [id]);
  return res.rows[0];
}

async function getUserCreatedProjects(userId) {
  const q = `
    SELECT p.*
    FROM prata.projects p
    WHERE p.creator_id = $1
    ORDER BY p.created_at DESC
  `;
  const res = await pool.query(q, [userId]);
  return res.rows;
}

async function getUserJoinedProjects(userId) {
  const q = `
    SELECT p.*
    FROM prata.projects p
    JOIN prata.volunteers v ON v.project_id = p.id
    WHERE v.user_id = $1
    ORDER BY v.joined_at DESC
  `;
  const res = await pool.query(q, [userId]);
  return res.rows;
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
  deleteUser,
  getUserCreatedProjects,
  getUserJoinedProjects
};
