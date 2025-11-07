const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  updateNoticeBoard,
  closeProject
} = require('../models/projectModel');

async function create(req, res) {
  try {
    const { title, description, notice_board, category_id, number_volunteer, project_date } = req.body;
    const creator_id = req.userId;

    if (!title || !description) {
      return res.status(400).json({ message: 'Título e descrição são obrigatórios' });
    }

    const project = await createProject({
      title,
      description,
      notice_board,
      category_id,
      creator_id,
      number_volunteer,
      project_date
    });

    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar projeto' });
  }
}

async function list(req, res) {
  try {
    const { category, status, creator, search } = req.query;
    const projects = await getProjects({ category, status, creator, search });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar projetos' });
  }
}

async function getOne(req, res) {
  try {
    const id = parseInt(req.params.id);
    const project = await getProjectById(id);
    if (!project) return res.status(404).json({ message: 'Projeto não encontrado' });
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar projeto' });
  }
}

async function update(req, res) {
  try {
    const id = parseInt(req.params.id);
    const { title, description, category_id, number_volunteer, project_date } = req.body;

    const existing = await getProjectById(id);
    if (!existing) return res.status(404).json({ message: 'Projeto não encontrado' });
    if (existing.creator_id !== req.userId) return res.status(403).json({ message: 'Sem permissão' });

    const updated = await updateProject(id, { title, description, category_id, number_volunteer, project_date });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar projeto' });
  }
}

async function updateNotice(req, res) {
  try {
    const id = parseInt(req.params.id);
    const { notice_board } = req.body;

    const existing = await getProjectById(id);
    if (!existing) return res.status(404).json({ message: 'Projeto não encontrado' });
    if (existing.creator_id !== req.userId) return res.status(403).json({ message: 'Sem permissão' });

    const updated = await updateNoticeBoard(id, notice_board);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar quadro de avisos' });
  }
}

async function close(req, res) {
  try {
    const id = parseInt(req.params.id);
    const existing = await getProjectById(id);
    if (!existing) return res.status(404).json({ message: 'Projeto não encontrado' });
    if (existing.creator_id !== req.userId) return res.status(403).json({ message: 'Sem permissão' });

    const closed = await closeProject(id);
    res.json(closed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao encerrar projeto' });
  }
}

module.exports = {
  create,
  list,
  getOne,
  update,
  updateNotice,
  close
};