const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const bodyParser = require("body-parser");

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

app.post("/api/recipe", async (req, res) => {
  const { ingredients } = req.body;
  const apiKey = process.env.SPOONACULAR_API_KEY;
  const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients.join(
    ","
  )}&number=1&apiKey=${apiKey}`;

  try {
    const response = await axios.get(url);
    console.log(response.data);
    const recipeId = response.data[0].id;
    const recipeUrl = `https://api.spoonacular.com/recipes/${recipeId}/analyzedInstructions?apiKey=${apiKey}`;

    const instructionsResponse = await axios.get(recipeUrl);
    console.log(instructionsResponse.data);

    res.json({
      recipe: {
        title: response.data[0].title,
        image: response.data[0].image,
        instructions: instructionsResponse.data[0].steps.map(
          (step) => step.step
        ),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
