const FormData = require('form-data');
const fs = require("fs");
const path = require("path");
const neatCsv = require('neat-csv');
const { mainModule } = require("process");
const axios = require('axios').default;

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

class Import {
    constructor() {
        this.recipeToImportList = [];
        this.recipeImportedList = [];
        this.recipeNotImportedList = [];
        this.recipeBeingImported = {};
        this.authorMap = null;
    }

    async getRecipeList() {
        const inputFile = await rf(path.join(__dirname, "recipe_import.csv"));
        this.recipeToImportList = await neatCsv(inputFile.toString())
    }

    getRecipeToImport(i) {
        this.recipeBeingImported = this.recipeToImportList[i];
    }

    async importRecipe() {
        try {
            await this._importAuthors();
            await this._importRecipe();
            await this._importImage();
            // everything was OK, recipe is imported
            this.recipeImportedList.push(this.recipeBeingImported);
        } catch (e) {
            // recipe failed to import, recipe is imported
            this.recipeBeingImported.error = e;
            this.recipeNotImportedList.push(this.recipeBeingImported);
        }
    }

    async _importAuthors() {
        // ověřit, jestli existuje AuthorMap - přehled všech autorů
        if (!this.authorMap) {
            // při prvním spuštění, pokud neexistuje - stáhne seznam knih a vytvoří autorMap
            // autorMap je objekt { "Jméno Příjmení": "id" } se všemi autory
            this.authorMap = {};
            const authorListResponse = await axios.get('http://localhost:3000/author/list');
            authorListResponse.data.forEach(author => {
                this.authorMap[`${author.firstname} ${author.lastname}`] = author;
            })
        }
        // převést seznam autorů na pole (u jedné knihy může být více autorů, například "Stephen Baxter, Arthur C. Clarke")
        const authorToImportList = this.recipeBeingImported.author.split(",");
        this.recipeBeingImported.authorList = [];
        // ověřit, jestli existuje autor importované knihy
        for (let j = 0; j < authorToImportList.length; j++) {
            // odebrat mezery na začátku / na konci autora - například z "Stephen Baxter, Arthur C. Clarke" vznikne ["Stephen Baxter", " Arthur C. Clarke"]
            const authorName = authorToImportList[j].trim();
            if (this.authorMap[authorName]) {
                this.recipeBeingImported.authorList.push(this.authorMap[authorName].id);
            } else {
                // poslední část jména je příjmení, vše před je křestní jméno, například "Arthur C.", "Clarke"
                const authorNameSplit = authorName.split(" ");
                const lastname = authorNameSplit.pop();
                const firstname = authorNameSplit.join(" ");
                // zavolat author/create server rozhraní
                const newAuthorResponse = await axios.post('http://localhost:3000/author/create', {
                    firstname: firstname,
                    lastname: lastname,
                });
                // přidat nově vytvořené ID do seznamu ID k importu knihy
                this.recipeBeingImported.authorList.push(newAuthorResponse.data.id)
                // přidat nového autora do this.authorMap
                this.authorMap[`${authorName}`] = newAuthorResponse.data;
            }
        }
    }

    async _importRecipe() {
        // s pomocí vybraných informací z this.recipeBeingImported vytvořit novou knihu
        const newRecipeResponse = await axios.post('http://localhost:3000/recipe/create', {
            id: this.recipeBeingImported.id,
            name: this.recipeBeingImported.name,
            authorList: this.recipeBeingImported.authorList,
        });
    }

    async _importImage() {
        const formData = new FormData();
        formData.append('id', this.recipeBeingImported.id);
        formData.append('data', await fs.createReadStream(path.join(__dirname, "images", this.recipeBeingImported.image)));
        const newRecipeImageResponse = await axios.post('http://localhost:3000/recipeImage/create', formData, {
            headers: formData.getHeaders()
        });
    }

    // uložit výsledky importu do samostatných souborů
    async storeResult() {
        const timeTs = new Date().toISOString().replace(/[^0-9]/g, "")
        await wf(path.join(__dirname, `${timeTs}_success.json`), JSON.stringify(this.recipeImportedList, null, 2))
        await wf(path.join(__dirname, `${timeTs}_failed.json`), JSON.stringify(this.recipeNotImportedList, null, 2))
    }
}

async function main() {
    const myImport = new Import();
    await myImport.getRecipeList()
    for (let i = 0; i < myImport.recipeToImportList.length; i++) {
        myImport.getRecipeToImport(i);
        await myImport.importRecipe();
    }
    await myImport.storeResult();
}

main()
