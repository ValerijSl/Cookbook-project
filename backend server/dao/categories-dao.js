"use strict";
const fs = require("fs");
const path = require("path");

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;


const DEFAULT_STORAGE_PATH = path.join(__dirname, "storage", "categories.json");

class CategoriesDao {
  constructor(storagePath) {
    this.categoryStoragePath = storagePath ? storagePath : DEFAULT_STORAGE_PATH;
  }

  async addCategory(category) {
    const categories = await this._addCategory(category);
    return categories;
  }

  async deleteCategory(name) {
    let categories = await this._loadAllCategories();
    const resultIndex = categories.findIndex(b => {
      return b.name === name;
    });
    let category = categories[resultIndex]
    if (category.recipes.length >= 0) {
      categories.splice(resultIndex, 1)
    }
    await wf(this._getStorageLocation(), JSON.stringify(categories, null, 2))
    return {};
  }

  async listAllCategories(){
      let categories = await this.__loadAllCategories();
      return categories;
  }

  
  async _loadAllCategories() {
    let categories;
    try {
      categories = JSON.parse(await rf(this._getStorageLocation()));
    } catch (e) {
      if (e.id === 'ENOENT') {
        console.info("No storage found, initializing new one...");
        categories = [];
      } else {
        throw new Error("Unable to read from storage. Wrong data format. " + this._getStorageLocation());
      }
    }
    return categories;
  }

  async _addCategory(category){
    let categories = await this._loadAllCategories();
    if (this._isDuplicate(categories, category.name)) {
      const e = new Error(`Category with name '${category.name}' already exists.`);
      e.id = "DUPLICATE_name";
      console.log(e);
      throw e;
    }
    try {
      categories.push(category)
      await wf(this._getStorageLocation(), JSON.stringify(categories, null, 2))
      return category;
    }catch(e){
      console.log(e);
      throw new Error("Unable to read from storage. " + this._getStorageLocation());
    }
  }
  
  _isDuplicate(categories, name) {
    const result = categories.find(b => {
      return b.name === name;
    });
    return result ? true : false;
  }

  
  _getStorageLocation() {
    return this.categoryStoragePath;
  }
}

module.exports = CategoriesDao; 