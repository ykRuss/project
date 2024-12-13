const express = require("express");
const router = express.Router();
const axios = require("axios");

// API details

const category = "inspirational";

const apiUrl = `https://api.api-ninjas.com/v1/quotes?category=${category}`;

// Assuming this route is in your Express backend
router.get("/", async (req, res) => {
  try {
    const response = await axios.get(apiUrl, {
      headers: { "X-Api-Key": process.env.API_KEY },
    });

    // Log the response data for debugging
    console.log("API Response:", response.data);

    // Extract quote and author from the response
    const quoteData = response.data[0];
    const quote = quoteData?.quote || "Stay inspired!";
    const author = quoteData?.author || "Unknown";

    console.log("Rendered Data:", { quote, author });

    // Send the quote and author as part of the response JSON
    res.json({
      quote,
      author,
    });
  } catch (error) {
    console.error("Error fetching quote:", error.message);

    // Return a fallback quote in case of an error
    res.json({
      quote: "An error occurred while fetching the quote.",
      author: "",
    });
  }
});
module.exports = router;
