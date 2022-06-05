const path = require("path");
const Ajv = require("ajv").default;
const userDao = require("../../dao/user-dao");
let dao = new userDao(path.join(__dirname, "..", "..", "storage", "users.json"))

let schema = {
  "type": "object",
  "properties": {
    "id": { "type": "string"},
    "firstname": { "type": "string" },
    "lastname": { "type": "string" },
    "description": { "type": "string" },
  },
  "required": ["id"]
};

async function UpdateAbl(req, res) {
  try {
    const ajv = new Ajv();
    let user = req.body
    const valid = ajv.validate(schema, user);
    if (valid) {
      user = await dao.updateUser(user);
      res.json(user);
    } else {
      res.status(400).send({
        errorMessage: "Validation of input failed.",
        params: user,
        reason: ajv.errors
      })
    }
  } catch (e) {
    if (e.message.startsWith("User with given id")) {
      res.status(400).json({ error: e.message });
    }
    res.status(500).send(e)
  }
}

module.exports = UpdateAbl;
