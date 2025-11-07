const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../models/categoryModel');

async function listCategories(req, res) {
  try {
    const categories = await getAllCategories();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar categorias' });
  }
}

async function getCategory(req, res) {
  try {
    const id = parseInt(req.params.id);
    const category = await getCategoryById(id);
    if (!category) return res.status(404).json({ message: 'Categoria não encontrada' });
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar categoria' });
  }
}

async function createNewCategory(req, res) {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Nome é obrigatório' });

    const category = await createCategory({ name, description });
    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar categoria' });
  }
}

async function updateCategoryById(req, res) {
  try {
    const id = parseInt(req.params.id);
    const { name, description } = req.body;

    const updated = await updateCategory(id, { name, description });
    if (!updated) return res.status(404).json({ message: 'Categoria não encontrada' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar categoria' });
  }
}

async function deleteCategoryById(req, res) {
  try {
    const id = parseInt(req.params.id);
    const deleted = await deleteCategory(id);
    if (!deleted) return res.status(404).json({ message: 'Categoria não encontrada' });
    res.json({ message: 'Categoria excluída com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao excluir categoria' });
  }
}

module.exports = {
  listCategories,
  getCategory,
  createNewCategory,
  updateCategoryById,
  deleteCategoryById
};
