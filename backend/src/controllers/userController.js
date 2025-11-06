const { findUserById, updateUser, deleteUser } = require('../models/userModel');

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

    const { name, bio, avatar } = req.body;
    const updated = await updateUser(id, { name, bio, avatar });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
}

async function deleteUserAccount(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (req.userId !== id) {
      return res.status(403).json({ message: 'Você só pode deletar sua própria conta' });
    }

    const deleted = await deleteUser(id);
    if (!deleted) return res.status(404).json({ message: 'Usuário não encontrado' });

    res.json({ message: 'Conta excluída com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao excluir usuário' });
  }
}

module.exports = {
  getUser,
  updateUserProfile,
  deleteUserAccount
};
