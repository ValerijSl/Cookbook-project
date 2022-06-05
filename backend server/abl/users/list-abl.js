const path = require("path");
const Ajv = require("ajv").default;
const userDao = require("../../dao/user-dao");
let dao = new userDao(path.join(__dirname, "..", "..", "storage", "users.json"))

let schema = {
  "type": "object",
  "properties": {},
  "required": []
};

async function ListAbl(req, res) {
  try {
    const users = await dao.listUsers();
    res.json(users);
  } catch (e) {
    res.status(500).send(e)
  }
}

module.exports = ListAbl;
