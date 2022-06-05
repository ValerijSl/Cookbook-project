const path = require("path");
const Ajv = require("ajv").default;
const RecipesDao = require("../../dao/recipes-dao");
let dao = new RecipesDao(path.join(__dirname, "..", "..", "storage", "recipes.json"))
//const AuthorDao = require("../../dao/authors-dao");
//let authorDao = new AuthorDao(path.join(__dirname, "..", "..", "storage", "authors.json"))

let schema = {
  "type": "object",
  "properties": {
    "id": { "type": "string"},
    "name": { "type": "string" },
    "description": { "type": "string" },
    "authorList": { "type": "array" }
  },
  "required": ["id"]
};

async function UpdateAbl(req, res) {
  try {
    const ajv = new Ajv();
    let recipe = req.body
    const valid = ajv.validate(schema, recipe);
    console.log(valid);
    if (valid) {
      recipe = await dao.updateRecipe(recipe);//authorlist to be fixed
      res.json(recipe);
    } else {
      res.status(400).send({
        errorMessage: "Validation of input failed.",
        params: recipe,
        reason: ajv.errors
      })
    }
  } catch (e) {
    if (e.message.startsWith("Recipe with given id")) {
      res.status(400).json({ error: e.message });
    }
    res.status(500).send(e)
  }
}

module.exports = UpdateAbl;
