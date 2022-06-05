import React, { useEffect, useState } from 'react';
import './home.css';
import {useParams} from "react-router-dom"
let porce = 1
function RecipeDetail (e){
  try{
  let porce = e.target.value
  }
  catch(e){
    console.log(e)
  }
  const {recipeId} = useParams()
  const [recipeData, setRecipeData] = useState({})
    useEffect(() => {
      fetch("http://localhost:3001/recipes/get?id="+recipeId)
      .then(res => res.json())
      .then(
        (res) => {
          setRecipeData({
            isLoaded: true,
            item: res
          });
          console.log(res)
          
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setRecipeData({
            isLoaded: true,
            error
          });
        }
      )
    }, [])
    
  try{
    let [divIngredients, setdivIngredients] = useState({})
    divIngredients = recipeData.item.ingredients.map((x) => <li>{x.name}: {x.value*porce}{x.unit}</li>)
    const instructions = recipeData.item.instructions.split("\n")
    const recipeInstructions = instructions.map((x) => <div>{x}</div>)
    function changePortions (e){
      porce = e.target.value
      let ingredients = JSON.parse(JSON.stringify(recipeData.item.ingredients))
      ingredients.forEach((x,i) => {
        ingredients[i].value = x.value * porce
      });
      divIngredients = ingredients.map((x) => <li>{x.name}: {x.value}{x.unit}</li>)
      setdivIngredients(divIngredients)
      console.log(divIngredients)
    };
  return(
  <div>
    <h1>{recipeData && recipeData.item.name}</h1>
    <p>Choose number of portions: 1-10</p>
    <input id="porce" type="number" min="1" max="10" onChange={changePortions}/>
    <ul>{divIngredients}</ul>
    {recipeInstructions}
  </div>
  )
}
  catch(e){
    console.log(e)
  }
}
/*
    let porce = 1
    const getInputValue = (e)=>{
      porce = e.target.value
  };
    const ingredients = recipeData.item.ingredients.map((x) => <li>{x.name}: {x.value}{x.unit}</li>)
    const instructions = recipeData.item.instructions.split("\n")
    const recipeInstructions = instructions.map((x) => <div>{x}</div>)
    console.log(porce)
    
  return(
  <div>
    <h1>{recipeData.item.name}</h1>
    <p>Choose number of portions: 1-10</p>
    <input id="porce" type="number" min="1" max="10" onChange={getInputValue}/>
    <ul>{ingredients}</ul>
    {recipeInstructions}
  </div>
}*/


  
export default RecipeDetail;