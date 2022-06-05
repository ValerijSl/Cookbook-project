const path = require("path");
const CategoriesDao = require("../../dao/categories-dao");
let dao = new CategoriesDao(path.join(__dirname, "..", "..", "storage", "category.json"))

async function AddAbl(req, res) {
  try {  
  let category = req.body;
  if (!category.name) {
    return res.status(400).json({error: 'Invalid input: name parameter is missing.'});
  }

  category = await dao.addCategory(category);
  res.json(category);
  } catch (e){
    if (e.message.includes("already exists")){
        res.status(400).send(e.message)
    }
    console.log(e);
    res.status(500).send(e)
  }
}

module.exports = AddAbl;