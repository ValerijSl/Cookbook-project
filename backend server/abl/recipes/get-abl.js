const path = require("path");
const RecipesDao = require("../../dao/recipes-dao");
let dao = new RecipesDao(path.join(__dirname, "..", "..", "storage", "recipes.json"))

async function GetAbl(recipeId, res) {
  try {  
  if (!recipeId) {
    return res.status(400).json({error: 'Invalid input: id parameter is missing.'});
  }

  const recipe = await dao.getRecipe(recipeId);

  if (!recipe) {
    return res.status(400).json({error: `Recipe with id '${recipeId}' doesn't exist.`});
  }

  res.json(recipe);
  } catch (e){
    res.status(500).send(e)
  }
}

module.exports = GetAbl;