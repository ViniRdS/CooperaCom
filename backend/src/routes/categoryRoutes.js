const express = require('express');
const router = express.Router();

const {
  listCategories,
  getCategory,
  createNewCategory,
  updateCategoryById,
  deleteCategoryById
} = require('../controllers/categoryController');

//Rotas públicas (listar e ver uma categoria)
router.get('/', listCategories);
router.get('/:id', getCategory);

//Rotas protegidas (Fazer depois: só admin pode criar/editar/deletar)
router.post('/', createNewCategory);
router.put('/:id', updateCategoryById);
router.delete('/:id', deleteCategoryById);

module.exports = router;
