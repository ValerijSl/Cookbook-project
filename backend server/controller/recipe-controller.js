const express = require("express");
const router = express.Router();

const AddAbl = require("../abl/recipes/add-abl");
const GetAbl = require("../abl/recipes/get-abl");
const DeleteAbl = require("../abl/recipes/delete-abl");
const UpdateAbl = require("../abl/recipes/update-abl");
const ListAllAbl = require("../abl/recipes/list-all-abl");
const PublishAbl = require("../abl/recipes/publish-abl");
const UnpublishAbl = require("../abl/recipes/publish-abl");
const FilterAbl = require("../abl/recipes/filter-abl");


router.get("/get", async (req, res) => {
  //const { query } = req;
  res.setHeader("Access-Control-Allow-Origin", "*")
  await GetAbl(req.query.id, res)
});

router.post("/add", async (req, res) => {
  //const { body } = req;
  await AddAbl(req, res)
});

router.post("/delete", async (req, res) => {
  //const { body } = req;
  await DeleteAbl(req, res)
});

router.post("/update", async (req, res) => {
  //const { body } = req;
  await UpdateAbl(req, res)
});

router.get("/listall", async (req, res) => {
  //const { body } = req;
  await ListAllAbl(req, res)
});

router.post("/publish", async (req, res) => {
  //const { body } = req;
  await PublishAbl(req, res)
});

router.post("/unpublish", async (req, res) => {
  //const { body } = req;
  await UnpublishAbl(req, res)
});

router.get("/filter", async (req, res) => {
  //const { body } = req;
  await FilterAbl(req, res)
});

module.exports = router