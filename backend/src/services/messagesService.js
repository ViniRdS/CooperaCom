const pool = require('../config/db');

async function saveMessage(projectId, senderId, content) {
  const q = `
    INSERT INTO messages (project_id, sender_id, content)
    VALUES ($1, $2, $3)
    RETURNING id, project_id, sender_id, content, created_at;
  `;
  const res = await pool.query(q, [projectId, senderId, content]);
  const msg = res.rows[0];

  const userRes = await pool.query('SELECT name FROM users WHERE id = $1', [senderId]);
  msg.sender_name = userRes.rows[0] ? userRes.rows[0].name : null;

  return msg;
}

async function getMessagesByProject(projectId, limit = 100) {
  const q = `
    SELECT m.id, m.project_id, m.sender_id, m.content, m.created_at,
           u.name AS sender_name, u.avatar
    FROM messages m
    LEFT JOIN users u ON m.sender_id = u.id
    WHERE m.project_id = $1
    ORDER BY m.created_at ASC
    LIMIT $2;
  `;
  const res = await pool.query(q, [projectId, limit]);
  return res.rows;
}

module.exports = {
  saveMessage,
  getMessagesByProject
};
