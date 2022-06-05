const path = require("path");
const Ajv = require("ajv").default;
const userDao = require("../../dao/user-dao");
let dao = new userDao(path.join(__dirname, "..", "..", "storage", "users.json"))

let schema = {
  "type": "object",
  "properties": {
    "firstname": { "type": "string" },
    "lastname": { "type": "string" },
    "description": { "type": "string" },
  },
  "required": ["firstname", "lastname"]
};

async function CreateAbl(req, res) {
  try {
    const ajv = new Ajv();
    const valid = ajv.validate(schema, req.body);
    if (valid) {
      let user = req.body;
      user = await dao.createUser(user);
      res.json(user);
    } else {
      res.status(400).send({
        errorMessage: "Validation of input failed.",
        params: req.body,
        reason: ajv.errors
      })
    }
  } catch (e) {
    if (e.message.includes("User with given id ")) {
      res.status(400).send({errorMessage: e.message, params: req.body})
    }
    res.status(500).send(e)
  }
}

module.exports = CreateAbl;
