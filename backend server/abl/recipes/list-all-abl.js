const path = require("path");
const Ajv = require("ajv").default;
const RecipesDao = require("../../dao/recipes-dao");
let dao = new RecipesDao(path.join(__dirname, "..", "..", "storage", "recipes.json"))

let schema = {
  "type": "object",
  "properties": {},
  "required": []
};

async function ListAllAbl(req, res) {
  try {
    const recipes = await dao.listAllRecipes();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(recipes);
  } catch (e) {
    res.status(500).send(e)
  }
}

module.exports = ListAllAbl;
