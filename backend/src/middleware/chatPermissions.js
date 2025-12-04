const pool = require('../config/db');

async function requireProjectMembership(req, res, next) {
  try {
    const userId = req.userId;
    const projectId = Number(req.params.projectId || req.body.projectId || req.query.projectId);

    if (!projectId) return res.status(400).json({ message: 'projectId obrigatório' });

    const pr = await pool.query('SELECT id, status, creator_id FROM projects WHERE id = $1', [projectId]);
    const project = pr.rows[0];
    if (!project) return res.status(404).json({ message: 'Projeto não encontrado' });


    if (project.creator_id === userId) {
      req.project = project;
      return next();
    }

    const vr = await pool.query('SELECT 1 FROM volunteers WHERE project_id = $1 AND user_id = $2', [projectId, userId]);
    if (vr.rows.length === 0) {
      return res.status(403).json({ message: 'Apenas criador ou voluntários podem acessar o chat deste projeto' });
    }

    req.project = project;
    next();
  } catch (err) {
    console.error('chatPermissions error', err);
    res.status(500).json({ message: 'Erro interno' });
  }
}

module.exports = { requireProjectMembership };
