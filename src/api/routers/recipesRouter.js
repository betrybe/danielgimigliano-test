const express = require('express');
const rescue = require('express-rescue');

const router = express.Router();
const controllers = require('../controllers');
const upload = require('../middlewares');

router.post('/', rescue(controllers.recipesController.createRecipe));
router.get('/', rescue(controllers.recipesController.getRecipeList));
router.get('/:id', rescue(controllers.recipesController.getRecipeById));
router.put('/:id', rescue(controllers.recipesController.updateRecipeById));
router.delete('/:id', rescue(controllers.recipesController.deleteRecipe));
router.put('/:id/image/', upload.single('image'), rescue(controllers.recipesController.includeImage));

module.exports = router;