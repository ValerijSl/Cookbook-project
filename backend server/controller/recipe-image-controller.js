const express = require("express");
const router = express.Router();

const busboy = require("busboy");
const AddAbl = require("../abl/recipe-image/add-abl");
const GetAbl = require("../abl/recipe-image/get-abl");

router.post("/add", (req,res) => {
  let myBusboy = busboy({ headers: req.headers, limits: {files: 1} });
  AddAbl(myBusboy, res)
  req.pipe(myBusboy);
});

router.get("/get", async (req, res) => {
  await GetAbl(req, res)
});

module.exports = router