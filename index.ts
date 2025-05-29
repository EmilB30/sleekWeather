import * as functions from "firebase-functions";
import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import cors from "cors";
import express from "express";
import { defineString } from "firebase-functions/params";
const OPENWEATHER_KEY = defineString("OPENWEATHER_KEY");

const app = express();

app.use(cors({ origin: ["https://sleekweather.web.app", "http://sleekweather.firebaseapp.com"], }));
const corsHandler = cors({ origin: true });
app.get("/weather", corsHandler, async (req, res) => {
  const apiKey = OPENWEATHER_KEY.value();
  const city = req.query.city || "London";

  try {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/forecast", // Fixed URL
      {
        params: {
          q: city,
          appid: apiKey,
          units: "metric"
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching weather data:", error.message);
    } else {
      console.error("Error fetching weather data:", error);
    }
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

export const api = functions.https.onRequest(app);
