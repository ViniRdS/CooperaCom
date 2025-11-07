const pool = require('../config/db');

async function joinProject(projectId, userId) {
  await pool.query(
    'INSERT INTO prata.volunteers (project_id, user_id) VALUES ($1, $2)',
    [projectId, userId]
  );
}

async function leaveProject(projectId, userId) {
  await pool.query(
    'DELETE FROM prata.volunteers WHERE project_id = $1 AND user_id = $2',
    [projectId, userId]
  );
}

async function isUserInProject(projectId, userId) {
  const res = await pool.query(
    'SELECT 1 FROM prata.volunteers WHERE project_id = $1 AND user_id = $2',
    [projectId, userId]
  );
  return res.rowCount > 0;
}

async function countVolunteers(projectId) {
  const res = await pool.query(
    'SELECT COUNT(*) AS total FROM prata.volunteers WHERE project_id = $1',
    [projectId]
  );
  return parseInt(res.rows[0].total, 10);
}

async function updateVolunteerCount(projectId) {
  const total = await countVolunteers(projectId);
  await pool.query(
    'UPDATE prata.projects SET current_volunteer = $1 WHERE id = $2',
    [total, projectId]
  );
}

async function listVolunteers(projectId) {
  const res = await pool.query(`
    SELECT u.id, u.name, u.email, u.avatar
    FROM prata.volunteers v
    JOIN prata.users u ON v.user_id = u.id
    WHERE v.project_id = $1
  `, [projectId]);
  return res.rows;
}

module.exports = {
  joinProject,
  leaveProject,
  isUserInProject,
  updateVolunteerCount,
  countVolunteers,
  listVolunteers
};