
# Blind Spots of Data: Mapping the World We Fail to Measure

This project is an academic visualization designed to reveal the hidden gaps in global data systems. It introduces the **Data Visibility Index (DVI)** to quantify how well countries are represented in international datasets.

## Architecture

- **Frontend:** React + Vite + Tailwind CSS + D3.js + Recharts
- **Backend:** Python (Pandas) for data processing, served via Express (Node.js) in development.
- **Data Source:** Dynamic CSV fetching from Our World in Data (OWID).

## Netlify Deployment

This project is designed to be deployed on Netlify.

### 1. Frontend
The React app is built using `npm run build` and served from the `dist/` directory.

### 2. Backend (Python Functions)
The Python logic in `api/` can be deployed as Netlify Functions.
- Move `api/functions.py` to `netlify/functions/data.py`.
- Ensure `requirements.txt` includes `pandas`, `requests`.

### 3. Configuration
The `netlify.toml` file handles the build and function settings.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server (Express + Vite):
   ```bash
   npm run dev
   ```

## Methodology

Visibility Index = 100 × (0.40 × Coverage + 0.35 × Recency + 0.25 × Continuity)

- **Coverage:** Fraction of indicators available.
- **Recency:** Proximity of latest data point to 2021.
- **Continuity:** Consistency of reporting across 2005–2021.
