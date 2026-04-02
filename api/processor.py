
import pandas as pd
import requests
import json
import os
from io import StringIO
from data_config import DATASETS, ANALYSIS_WINDOW, LATEST_GLOBAL_YEAR, WEIGHTS

CACHE_DIR = "cache"
if not os.path.exists(CACHE_DIR):
    os.makedirs(CACHE_DIR)

def fetch_csv(name, url):
    cache_path = os.path.join(CACHE_DIR, f"{name}.csv")
    if os.path.exists(cache_path):
        return pd.read_csv(cache_path)
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        df = pd.read_csv(StringIO(response.text))
        df.to_csv(cache_path, index=False)
        return df
    except Exception as e:
        print(f"Error fetching {name}: {e}")
        return None

def process_data():
    all_data = {}
    countries = set()
    indicator_metadata = {}
    
    for name, url in DATASETS.items():
        df = fetch_csv(name, url)
        if df is not None:
            # Standardize columns: Entity, Code, Year, Value
            val_col = [c for c in df.columns if c not in ['Entity', 'Code', 'Year']][0]
            df = df.rename(columns={val_col: 'value'})
            
            # Filter to valid codes (3-letter ISO)
            df = df[df['Code'].notna() & (df['Code'].str.len() == 3)]
            
            all_data[name] = df
            countries.update(df['Code'].unique())
            
            # Calculate global metadata for this indicator
            indicator_metadata[name] = {
                "global_latest": int(df['Year'].max()),
                "global_start": int(df['Year'].min()),
                "total_global_years": int(df['Year'].max() - df['Year'].min() + 1)
            }
    
    results = []
    RANGE_CAP = 3 # As requested (2 or 3)
    
    for code in countries:
        country_name = ""
        indicator_stats = {}
        
        # 1. Coverage: Fraction of indicators available
        present_indicators = 0
        total_indicators = len(DATASETS)
        
        # Scores per indicator to be averaged
        recency_scores = []
        continuity_scores = []
        
        for name, df in all_data.items():
            c_df = df[df['Code'] == code]
            if not c_df.empty:
                present_indicators += 1
                country_name = c_df.iloc[0]['Entity']
                
                # Latest year for this country and indicator
                country_latest = int(c_df['Year'].max())
                global_latest = indicator_metadata[name]["global_latest"]
                
                # Recency_ij = 1 - (global_latest - country_latest) / RANGE_CAP
                diff = global_latest - country_latest
                r_score = max(0, 1 - (diff / RANGE_CAP))
                recency_scores.append(r_score)
                
                # Continuity_ij = (# years with data) / (# years indicator exists globally)
                # Note: The user said "analysis window where this indicator exists globally"
                # We'll use the full global range of the indicator as the window.
                num_years_data = len(c_df['Year'].unique())
                total_global_years = indicator_metadata[name]["total_global_years"]
                c_score = num_years_data / total_global_years
                continuity_scores.append(c_score)
                
                # Store full history
                history = c_df.sort_values('Year')[['Year', 'value']].to_dict('records')
                
                indicator_stats[name] = {
                    "latest_year": country_latest,
                    "latest_value": float(c_df.sort_values('Year').iloc[-1]['value']),
                    "history": history
                }
            else:
                indicator_stats[name] = None

        coverage = present_indicators / total_indicators
        recency = sum(recency_scores) / len(recency_scores) if recency_scores else 0
        continuity = sum(continuity_scores) / len(continuity_scores) if continuity_scores else 0
        
        visibility_index = 100 * (
            WEIGHTS["coverage"] * coverage + 
            WEIGHTS["recency"] * recency + 
            WEIGHTS["continuity"] * continuity
        )
        
        # Visibility Band
        if visibility_index >= 80: band = "High Visibility"
        elif visibility_index >= 60: band = "Moderate Visibility"
        elif visibility_index >= 40: band = "Low Visibility"
        else: band = "Data Blind Spot"
        
        results.append({
            "code": code,
            "name": country_name,
            "visibility_index": round(visibility_index, 2),
            "visibility_band": band,
            "metrics": {
                "coverage": round(coverage, 3),
                "recency": round(recency, 3),
                "continuity": round(continuity, 3)
            },
            "indicators": indicator_stats
        })
        
    return results

if __name__ == "__main__":
    # For testing/CLI usage
    print("Processing data... this may take a minute.")
    data = process_data()
    output_path = "api_cache.json"
    with open(output_path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"Successfully processed {len(data)} countries and saved to {output_path}")
