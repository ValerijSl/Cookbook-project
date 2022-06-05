const express = require("express");
const path = require('path');
const app = express();
const port = 3001;
const recipeRouter = require("./controller/recipe-controller");
const recipeImageRouter = require("./controller/recipe-image-controller");
const categoryRouter = require("./controller/category-controller");

//const cors = require("cors")
//    app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app.use("/recipe.js", function(req,res) {
//    res.sendFile(path.join(__dirname+'/hi/recipe.js'));
//})

//app.use("/recipe-list.js", function(req,res) {
//    res.sendFile(path.join(__dirname+'/hi/recipe-list.js'));
//})

app.use ("/recipes", recipeRouter);

app.use ("/categories", categoryRouter);

app.use("/recipeImage", recipeImageRouter);

app.get("/", function(req,res) {
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.listen(port, () => {console.log('App listening at hhtp://localhost: 3001')});
