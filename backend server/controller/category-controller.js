const express = require("express");
const router = express.Router();

const AddAbl = require("../abl/categories/add-abl");
const DeleteAbl = require("../abl/categories/delete-abl");
const ListAbl = require("../abl/categories/list-abl");
const AddRecipeAbl = require("../abl/categories/add-recipe-abl");

router.post("/add", async (req, res) => {
  await AddAbl(req, res)
});

router.post("/delete", async (req, res) => {
  await DeleteAbl(req, res)
});

router.get("/list", async (req, res) => {
  await ListAbl(req, res)
});

router.post("/addRecipe", async (req, res) => {
  await AddRecipeAbl(req, res)
});

module.exports = router
