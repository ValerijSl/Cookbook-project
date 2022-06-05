const path = require("path");
const RecipesDao = require("../../dao/recipes-dao");
let dao = new RecipesDao(path.join(__dirname, "..", "..", "storage", "recipes.json"))


async function AddAbl(req, res) {
  try {  
  let recipe = req.body;
  if (!recipe.id) {
    return res.status(400).json({error: 'Invalid input: id parameter is missing.'});
  }

  recipe = await dao.addRecipe(recipe);
  res.json(recipe);
  } catch (e){
    if (e.message.includes("already exists")){
        res.status(400).send(e.message)
    }
    console.log(e);
    res.status(500).send(e)
  }
}

module.exports = AddAbl;