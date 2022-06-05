const fs = require("fs");
const path = require("path");
const Ajv = require("ajv").default;
const RecipesDao = require("../../dao/recipes-dao");
let dao = new RecipesDao(path.join(__dirname, "..", "..", "storage", "recipes.json"))

const addRecipeImageSchema = {
    "type": "object",
    "properties": {
        "id": { "type": "string" },
    },
    "required": ["id"]
};

async function AddAbl(busboy, res) {
    let dtoIn = {};
    // textová část multipartu, ze které složíme vstup naší routy k validaci
    busboy.on("field", function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
        dtoIn[fieldname] = val;
    });

    // budeme předpokládat, že soubor se v multipartu uvádí jako poslední pro jednoduchost
    busboy.on("file", async (name, file, info) => {
        const { mimeType } = info;

        // validace vstupu
        const ajv = new Ajv();
        const valid = ajv.validate(addRecipeImageSchema, dtoIn);

        // nevalidní vstup
        if (!valid) {
            return res.status(400).json({ error: ajv.errors });
        }

        // ověření, že kniha existuje, aby nemohl existovat samotný obrázek
        const recipe = await dao.getRecipe(dtoIn.id);
        if (!recipe) {
            return res.status(400).json({ error: `Recipe with code '${dtoIn.id}' doesn't exist.` });
        }

        // omezení, že obrázek musí být ve formátu .png, aby nebylo možné nahrát jiný soubor
        if (mimeType !== "image/png" && mimeType !== "image/jpeg") {
            return res.status(400).json({ error: `Only supported mimeType is image/png and image/jpeg` });
        }

        // soubor si ukládáme pod id dané knihy pro následné snadné dohledání
        let saveTo = path.join(__dirname, "..", "..", "storage", dtoIn.id + ".png");
        let writeStream = fs.addWriteStream(saveTo);
        file.pipe(writeStream);
    });

    // úspěšně se nahrál obrázek
    busboy.on("finish", function () {
        res.json({ status: "File succesfully uploaded!" });
    });

    // nastala chyba během přenosu
    busboy.on("error", err => {
        res.json({ error: err })
    });
}

module.exports = AddAbl;