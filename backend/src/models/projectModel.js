const pool = require('../config/db');

async function createProject({ title, description, notice_board, category_id, creator_id, number_volunteer, project_date }) {
  const res = await pool.query(
    `INSERT INTO prata.projects 
      (title, description, notice_board, category_id, creator_id, number_volunteer, current_volunteer, project_date)
     VALUES ($1, $2, COALESCE($3, NULL), $4, $5, $6, 0, $7)
     RETURNING *`,
    [title, description, notice_board, category_id, creator_id, number_volunteer, project_date]
  );
  return res.rows[0];
}

//Listar projetos (com filtros opcionais)
async function getProjects({ category, status, creator, search }) {
  let query = `SELECT p.*, u.name AS creator_name, c.name AS category_name
               FROM prata.projects p
               LEFT JOIN prata.users u ON p.creator_id = u.id
               LEFT JOIN prata.categories c ON p.category_id = c.id
               WHERE 1=1`;
  const values = [];
  let i = 1;

  if (category) {
    query += ` AND p.category_id = $${i++}`;
    values.push(category);
  }
  if (status) {
    query += ` AND p.status = $${i++}`;
    values.push(status);
  }
  if (creator) {
    query += ` AND p.creator_id = $${i++}`;
    values.push(creator);
  }
  if (search) {
    query += ` AND (p.title ILIKE $${i} OR p.description ILIKE $${i})`;
    values.push(`%${search}%`);
  }

  query += ` ORDER BY p.created_at DESC`;
  const res = await pool.query(query, values);
  return res.rows;
}

async function getProjectById(id) {
  const res = await pool.query(
    `SELECT p.*, u.name AS creator_name, c.name AS category_name
     FROM prata.projects p
     LEFT JOIN prata.users u ON p.creator_id = u.id
     LEFT JOIN prata.categories c ON p.category_id = c.id
     WHERE p.id = $1`,
    [id]
  );
  return res.rows[0];
}

async function updateProject(id, { title, description, category_id, number_volunteer, project_date }) {
  const res = await pool.query(
    `UPDATE prata.projects
     SET 
       title = COALESCE($1, title),
       description = COALESCE($2, description),
       category_id = COALESCE($3, category_id),
       number_volunteer = COALESCE($4, number_volunteer),
       project_date = COALESCE($5, project_date),
       updated_at = CURRENT_TIMESTAMP
     WHERE id = $6
     RETURNING *`,
    [title, description, category_id, number_volunteer, project_date, id]
  );
  return res.rows[0];
}

async function updateNoticeBoard(id, notice_board) {
  const res = await pool.query(
    `UPDATE prata.projects
     SET notice_board = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *`,
    [notice_board, id]
  );
  return res.rows[0];
}

async function closeProject(id) {
  const res = await pool.query(
    `UPDATE prata.projects
     SET status = 'encerrado', updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *`,
    [id]
  );
  return res.rows[0];
}

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  updateNoticeBoard,
  closeProject
};