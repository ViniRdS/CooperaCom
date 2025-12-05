const pool = require('../config/db');
const {
  joinProject,
  leaveProject,
  isUserInProject,
  updateVolunteerCount,
  countVolunteers,
  listVolunteers
} = require('../models/volunteerModel');

async function join(req, res) {
  const projectId = parseInt(req.params.projectId);
  const userId = req.userId;

  try {
    const projectRes = await pool.query(
      'SELECT id, status, number_volunteer, current_volunteer FROM projects WHERE id = $1',
      [projectId]
    );
    const project = projectRes.rows[0];
    if (!project) return res.status(404).json({ message: 'Projeto não encontrado' });

    if (project.status !== 'ativo') {
      return res.status(400).json({ message: 'Este projeto não está ativo' });
    }

    const alreadyJoined = await isUserInProject(projectId, userId);
    if (alreadyJoined) {
      return res.status(400).json({ message: 'Você já participa deste projeto' });
    }

    const total = await countVolunteers(projectId);
    if (project.number_volunteer && total >= project.number_volunteer) {
      return res.status(400).json({ message: 'Este projeto já atingiu o número máximo de voluntários.' });
    }

    await joinProject(projectId, userId);
    await updateVolunteerCount(projectId);

    res.json({ message: 'Você entrou no projeto com sucesso!' });
  } catch (err) {
    console.error('Erro ao entrar no projeto:', err);
    res.status(500).json({ message: 'Erro interno ao entrar no projeto' });
  }
}

async function leave(req, res) {
  const projectId = parseInt(req.params.projectId);
  const userId = req.userId;

  try {
    const joined = await isUserInProject(projectId, userId);
    if (!joined) return res.status(400).json({ message: 'Você não participa deste projeto' });

    await leaveProject(projectId, userId);
    await updateVolunteerCount(projectId);

    res.json({ message: 'Você saiu do projeto com sucesso.' });
  } catch (err) {
    console.error('Erro ao sair do projeto:', err);
    res.status(500).json({ message: 'Erro interno ao sair do projeto' });
  }
}

async function removeVolunteer(req, res) {
  const projectId = parseInt(req.params.projectId);
  const volunteerId = parseInt(req.params.userId);
  const userId = req.userId;

  try {
    const projectRes = await pool.query('SELECT creator_id FROM projects WHERE id = $1', [projectId]);
    const project = projectRes.rows[0];
    if (!project) return res.status(404).json({ message: 'Projeto não encontrado' });

    if (project.creator_id !== userId) {
      return res.status(403).json({ message: 'Apenas o criador do projeto pode remover voluntários.' });
    }

    //Verifica se o usuário realmente está no projeto antes de remover
    const isInProject = await isUserInProject(projectId, volunteerId);
    if (!isInProject) {
      return res.status(400).json({ message: 'Este usuário não participa deste projeto.' });
    }

    await leaveProject(projectId, volunteerId);
    await updateVolunteerCount(projectId);

    res.json({ message: 'Voluntário removido do projeto com sucesso.' });
  } catch (err) {
    console.error('Erro ao remover voluntário:', err);
    res.status(500).json({ message: 'Erro interno ao remover voluntário' });
  }
}

async function getVolunteers(req, res) {
  const projectId = parseInt(req.params.projectId);

  try {
    const volunteers = await listVolunteers(projectId);
    res.json(volunteers);
  } catch (err) {
    console.error('Erro ao listar voluntários:', err);
    res.status(500).json({ message: 'Erro interno ao listar voluntários' });
  }
}

module.exports = {
  join,
  leave,
  removeVolunteer,
  getVolunteers
};
