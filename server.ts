
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { execSync } from "child_process";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Mock data for when Python is unavailable or for speed
  // In a real Netlify deploy, the Python functions would be separate.
  // Here we'll try to run the python script to generate data.json if it doesn't exist
  
  app.get("/api/data", (req, res) => {
    const cachePath = path.join(process.cwd(), "api_cache.json");
    
    if (fs.existsSync(cachePath)) {
      const data = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
      return res.json(data);
    }

    try {
      // Try to run python processor
      // Note: This might fail if pandas/requests aren't installed.
      // We'll provide a fallback mock data generator in TS if it fails.
      let output;
      try {
        output = execSync("python3 -c 'from api.processor import process_data; import json; print(json.dumps(process_data()))'").toString();
      } catch (e) {
        // Fallback to 'python' if 'python3' is not in path
        output = execSync("python -c 'from api.processor import process_data; import json; print(json.dumps(process_data()))'").toString();
      }
      fs.writeFileSync(cachePath, output);
      res.json(JSON.parse(output));
    } catch (error) {
      console.error("Python processing failed:", error);
      console.log("Using fallback mock data for now.");
      // Fallback mock data generation
      const mockData = generateMockData();
      res.json(mockData);
    }
  });

  app.get("/api/overview", async (req, res) => {
    // Simplified overview
    res.json({
      total_countries: 195,
      avg_visibility: 68.4,
      bands: {
        "High": 45,
        "Moderate": 82,
        "Low": 48,
        "Blind Spot": 20
      }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

function generateMockData() {
  const countries = ["USA", "GBR", "FRA", "DEU", "CHN", "IND", "BRA", "NGA", "ZAF", "AFG", "YEM", "SOM", "SSD", "CAF"];
  const names = ["United States", "United Kingdom", "France", "Germany", "China", "India", "Brazil", "Nigeria", "South Africa", "Afghanistan", "Yemen", "Somalia", "South Sudan", "Central African Republic"];
  
  const years = Array.from({ length: 22 }, (_, i) => 2000 + i);

  return countries.map((code, i) => {
    const visibility = i < 4 ? 85 + Math.random() * 10 : (i < 9 ? 60 + Math.random() * 20 : 20 + Math.random() * 30);
    let band = "Data Blind Spot";
    if (visibility >= 80) band = "High Visibility";
    else if (visibility >= 60) band = "Moderate Visibility";
    else if (visibility >= 40) band = "Low Visibility";

    const generateHistory = (base: number) => {
      return years.map(y => ({
        Year: y,
        value: base + Math.sin((y - 2000) / 2) * (base / 10) + Math.random() * (base / 20)
      }));
    };

    return {
      code,
      name: names[i],
      visibility_index: Math.round(visibility * 100) / 100,
      visibility_band: band,
      metrics: {
        coverage: Math.random(),
        recency: Math.random(),
        continuity: Math.random()
      },
      indicators: {
        life_expectancy: { 
          latest_year: 2021, 
          latest_value: 75,
          history: generateHistory(75)
        },
        gdp_per_capita: { 
          latest_year: 2021, 
          latest_value: 15000,
          history: generateHistory(15000)
        }
      }
    };
  });
}

startServer();
