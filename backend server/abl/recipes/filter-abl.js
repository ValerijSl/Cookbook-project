const path = require("path");
const RecipesDao = require("../../dao/recipes-dao");
let dao = new RecipesDao(path.join(__dirname, "..", "..", "storage", "recipes.json"))

async function FilterAbl(req, res) {
  try {  
  let category = req.body.category;
  if (!category) {
    return res.status(400).json({error: 'Invalid input: category parameter is missing.'});
  }

  recipes = await dao.filterRecipe(category);
  res.json(recipes);
  } catch (e){
    if (e.message.includes("category doesnt exist")){
        res.status(400).send(e.message)
    }
    console.log(e);
    res.status(500).send(e)
  }
}

module.exports = FilterAbl;