import React, { useState } from "react";
import "./Recipe.css";

function Recipe() {
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    console.log("Ingredients:", ingredients.split(","));
    if (ingredients.trim() === "") {
      alert("Please enter at least one ingredient.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch("https://ratatoille-recipe-app-backend.vercel.app//api/recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients: ingredients.split(",") }),
      });
      const data = await response.json();
      if (data.recipe) {
        console.log(data.recipe)
        setRecipe(data.recipe);
      } else {
        setRecipe(null);
      }
      setLoading(false);
    } catch (error) {
      console.error(error.message);
      setLoading(false);
    }
  }

  return (
    <div className="recipe-container">
      <h1 className="recipe-title">What ingredients do you have?</h1>
      <p>Super simple app to find any recipe based on random items you have around</p>
      <form onSubmit={handleSubmit} className="recipe-form">
        <input
          type="text"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Enter ingredients (separated by commas)"
          className="recipe-input"
        />
        <button type="submit" className="recipe-button">
          {loading ? "Loading..." : "Get Recipe"}
        </button>
      </form>
      {recipe ? (
        <div className="recipe-result">
          {recipe.title && (
            <h2 className="recipe-result-title">{recipe.title}</h2>
          )}
          <div className="recipe-instructions">
            <h3 className="recipe-instructions-title">Instructions:</h3>
            {recipe.instructions.map((step, index) => (
              <p key={index} className="recipe-instructions-text">
                {index + 1}. {step}
              </p>
            ))}
            <div className="recipe-image">
              <img src={recipe.image} alt="recipe" className="recipe-image" />
            </div>
          </div>
        </div>
      ) : null}
      {loading && <p>Loading...</p>}
    </div>
  );
}

export default Recipe;

