const { findUserById, updateUser, deleteUser, getUserCreatedProjects, getUserJoinedProjects } = require('../models/userModel');
const { removeUserFromAllActiveProjects } = require('../models/volunteerModel');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

async function getUser(req, res) {
  try {
    const id = parseInt(req.params.id);
    const user = await findUserById(id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar usuário' });
  }
}

async function updateUserProfile(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (req.userId !== id) {
      return res.status(403).json({ message: 'Você só pode editar seu próprio perfil' });
    }

    const { name, bio, avatar, password } = req.body;

    let password_hash = null;

    if (password && password.trim().length > 0) {
      password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    }

    const updated = await updateUser(id, {
      name,
      bio,
      avatar,
      password_hash
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
}

async function deleteUserAccount(req, res) {
  console.log("req.userId =", req.userId);
  try {
    const id = parseInt(req.params.id);
    if (req.userId !== id) {
      return res.status(403).json({ message: 'Você só pode deletar sua própria conta' });
    }
    
    await removeUserFromAllActiveProjects(id);
    const deleted = await deleteUser(id);
    if (!deleted) return res.status(404).json({ message: 'Usuário não encontrado' });

    res.json({ message: 'Conta excluída com sucesso' });
  } catch (err) {
  console.error("ERRO AO EXCLUIR:", err);
  res.status(500).json({ message: "Erro ao excluir usuário", detalhe: err.message });
}
}

async function getCreatedProjects(req, res) {
  try {
    const id = parseInt(req.params.id);
    const projects = await getUserCreatedProjects(id);
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar projetos criados' });
  }
}

async function getJoinedProjects(req, res) {
  try {
    const id = parseInt(req.params.id);
    const projects = await getUserJoinedProjects(id);
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar projetos que o usuário participa' });
  }
}

module.exports = {
  getUser,
  updateUserProfile,
  deleteUserAccount,
  getCreatedProjects,
  getJoinedProjects
};
