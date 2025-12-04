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

async function removeUserFromAllActiveProjects(userId) {
  // 1. Pega os projetos ativos onde o usuário participa
  const activeProjects = await pool.query(`
    SELECT project_id
    FROM prata.volunteers v
    INNER JOIN prata.projects p ON p.id = v.project_id
    WHERE v.user_id = $1 AND p.status = 'ativo'
  `, [userId]);

  // 2. Remove o usuário de todos os projetos ativos
  await pool.query(`
    DELETE FROM prata.volunteers
    WHERE user_id = $1
    AND project_id IN (SELECT id FROM prata.projects WHERE status = 'ativo')
  `, [userId]);

  // 3. Recalcula o current_volunteer de cada projeto
  for (const row of activeProjects.rows) {
    await pool.query(`
      UPDATE prata.projects
      SET current_volunteer = (
        SELECT COUNT(*)
        FROM prata.volunteers
        WHERE project_id = $1 AND user_id IS NOT NULL
      )
      WHERE id = $1
    `, [row.project_id]);
  }
}


module.exports = {
  joinProject,
  leaveProject,
  isUserInProject,
  updateVolunteerCount,
  countVolunteers,
  listVolunteers,
  removeUserFromAllActiveProjects
};