const path = require("path");
const Ajv = require("ajv").default;
const userDao = require("../../dao/user-dao");
let dao = new userDao(path.join(__dirname, "..", "..", "storage", "users.json"))

let schema = {
  "type": "object",
  "properties": {
    "id": { "type": "string"}
  },
  "required": ["id"]
};

async function DeleteAbl(req, res) {
  const ajv = new Ajv();
  const valid = ajv.validate(schema, req.body);
  try {
    if (valid) {
      const userId = req.body.id;
      await dao.deleteUser(userId);
      res.json({});
    } else {
      res.status(400).send({
        errorMessage: "Validation of input failed.",
        params: req.body,
        reason: ajv.errors
      })
    }
  } catch (e) {
    res.status(500).send(e.message)
  }
}

module.exports = DeleteAbl;
