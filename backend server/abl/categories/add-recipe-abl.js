const path = require("path");
const CategoriesDao = require("../../dao/categories-dao");
let dao = new CategoriesDao(path.join(__dirname, "..", "..", "storage", "category.json"))

async function AddRecipeAbl(req, res) {
  try {  
  let id = req.body;
  if (!id) {
    return res.status(400).json({error: 'Invalid input: name parameter is missing.'});
  }

  id = await dao.addCategory(id);
  res.json(id);
  } catch (e){
    if (e.message.includes("already exists")){
        res.status(400).send(e.message)
    }
    console.log(e);
    res.status(500).send(e)
  }
}

module.exports = AddRecipeAbl;