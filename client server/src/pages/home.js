import React from 'react';
import './home.css';
import { Link } from "react-router-dom";

function detail (id){
  
    fetch("http://localhost:3001/recipes/listall")
      .then(res => res.json())
      .then(
        (res) => {
          this.setState({
            isLoaded: true,
            item: res
          });
          
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  
}

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      item: null
    };
  }

  componentDidMount() {
    fetch("http://localhost:3001/recipes/listall")
      .then(res => res.json())
      .then(
        (res) => {
          this.setState({
            isLoaded: true,
            item: res
          });
          
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, item } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      console.log(item);
      const list = item.map((recipe) => 
     
         
            <li>
              <div id = "recipe">{recipe.name} </div> <div id = "recipe">{recipe.time.value} {recipe.time.unit}</div> <Link to={`/recipeDetail/${recipe.id}`}>{recipe.name}</Link>
            </li>
          
       )
      return (

        <ul id = "recipe-list">
          {list}
        </ul>
      );
    }
  }
}


  
export default Home;