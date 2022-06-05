"use strict";
const fs = require("fs");
const path = require("path");

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;


const DEFAULT_STORAGE_PATH = path.join(__dirname, "storage", "recipes.json");

class RecipesDao {
  constructor(storagePath) {
    this.recipeStoragePath = storagePath ? storagePath : DEFAULT_STORAGE_PATH;
  }

  
  async getRecipe(id) {
    let recipes = await this._loadAllRecipes();
    const result = recipes.find(b => {
      return b.id === id;
    });
    return result;
  }

  async filterRecipe(category) {
    let recipes = await this._loadAllRecipes();
    let result = {}
    recipes.forEach(recipe => {
      if (category == recipe.category){
        result.push(recipe)
      }
    });
    console.log(result)
    return result;
  }

  
  async addRecipe(recipe) {
    const recipes = await this._addRecipe(recipe);
    return recipes;
  }

  async updateRecipe(recipe) {
    let recipes = await this._loadAllRecipes();
    const resultIndex = recipes.findIndex(b => {
      return b.id === recipe.id;
    });
    if (resultIndex < 0) {
      throw new Error(`Recipe with given id ${recipe.id} does not exists.`);
    } else {
      recipes[resultIndex] = {
        ...recipes[resultIndex],
        ...recipe
      }
    }
    await wf(this._getStorageLocation(), JSON.stringify(recipes, null, 2))
    return recipes[resultIndex];
  }

  async publishRecipe(id) {
    let recipes = await this._loadAllRecipes();
    const resultIndex = recipes.findIndex(b => {
      return b.id === id;
    });
    if (resultIndex < 0) {
      throw new Error(`Recipe with given id ${id} does not exists.`);
    } else {
      recipes[resultIndex].public = "True";
    }
    await wf(this._getStorageLocation(), JSON.stringify(recipes, null, 2))
    return recipes[resultIndex];
  }

  async unpublishRecipe(id) {
    let recipes = await this._loadAllRecipes();
    const resultIndex = recipes.findIndex(b => {
      return b.id === id;
    });
    if (resultIndex < 0) {
      throw new Error(`Recipe with given id ${id} does not exists.`);
    } else {
      recipes[resultIndex].public = "False";
    }
    await wf(this._getStorageLocation(), JSON.stringify(recipes, null, 2))
    return recipes[resultIndex];
  }

  async deleteRecipe(id) {
    let recipes = await this._loadAllRecipes();
    const resultIndex = recipes.findIndex(b => {
      return b.id === id;
    });
    if (resultIndex >= 0) {
      recipes.splice(resultIndex, 1)
    }
    await wf(this._getStorageLocation(), JSON.stringify(recipes, null, 2))
    return {};
  }

  async listAllRecipes(){
      let recipes = await this._loadAllRecipes();
      return recipes;
  }

  
  async _loadAllRecipes() {
    let recipes;
    try {
      recipes = JSON.parse(await rf(this._getStorageLocation()));
    } catch (e) {
      if (e.id === 'ENOENT') {
        console.info("No storage found, initializing new one...");
        recipes = [];
      } else {
        throw new Error("Unable to read from storage. Wrong data format. " + this._getStorageLocation());
      }
    }
    return recipes;
  }

  async _addRecipe(recipe){
    let recipes = await this._loadAllRecipes();
    if (this._isDuplicate(recipes, recipe.id)) {
      const e = new Error(`Recipe with id '${recipe.id}' already exists.`);
      e.id = "DUPLICATE_id";
      console.log(e);
      throw e;
    }
    try {
      recipes.push(recipe)
      await wf(this._getStorageLocation(), JSON.stringify(recipes, null, 2))
      return recipe;
    }catch(e){
      console.log(e);
      throw new Error("Unable to read from storage. " + this._getStorageLocation());
    }
  }
  
  _isDuplicate(recipes, id) {
    const result = recipes.find(b => {
      return b.id === id;
    });
    return result ? true : false;
  }

  
  _getStorageLocation() {
    return this.recipeStoragePath;
  }
}

module.exports = RecipesDao; 