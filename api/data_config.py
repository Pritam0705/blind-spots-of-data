
# OWID Dataset URLs and Configuration
DATASETS = {
    "life_expectancy": "https://ourworldindata.org/grapher/life-expectancy.csv?v=1&csvType=full&useColumnShortNames=false",
    "child_mortality": "https://ourworldindata.org/grapher/child-mortality.csv?v=1&csvType=full&useColumnShortNames=false",
    "maternal_mortality": "https://ourworldindata.org/grapher/maternal-mortality.csv?v=1&csvType=full&useColumnShortNames=false",
    "internet_usage": "https://ourworldindata.org/grapher/share-of-individuals-using-the-internet.csv?v=1&csvType=full&useColumnShortNames=false",
    "schooling": "https://ourworldindata.org/grapher/mean-years-of-schooling-long-run.csv?v=1&csvType=full&useColumnShortNames=false",
    "gdp_per_capita": "https://ourworldindata.org/grapher/gdp-per-capita-worldbank.csv?v=1&csvType=full&useColumnShortNames=false"
}

ANALYSIS_WINDOW = (2005, 2021)
LATEST_GLOBAL_YEAR = 2021

# Weights for Visibility Index
WEIGHTS = {
    "coverage": 0.40,
    "recency": 0.35,
    "continuity": 0.25
}
