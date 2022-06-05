import logo from './logo.svg';
import React, {Component} from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route}
	from 'react-router-dom';
	import { Link, Switch } from "react-router-dom";
import Home from './pages/home';
import About from './pages/about';
import AddRecipe from './pages/addRecipe';
import SignUp from './pages/signup';
import Contact from './pages/contact';
import RecipeDetail from './pages/RecipeDetail';
function App() {

return (
	<Router>
	<Navbar/>
	<Routes>
		<Route exact path='/' element={<Home />} />
		<Route path='/about' element={<About/>} />
		<Route path='/contact' element={<Contact/>} />
		<Route path='/addRecipe' element={<AddRecipe/>} />
		<Route path='/sign-up' element={<SignUp/>} />
		<Route path='/recipeDetail/:recipeId' element={<RecipeDetail/>} />
	</Routes>

        
	</Router>
	
	
);
}

export default App;
