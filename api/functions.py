
import json
from processor import process_data

def handler(event, context):
    # Netlify function handler
    try:
        data = process_data()
        
        # Filter based on path if needed
        path = event.get('path', '')
        
        if 'overview' in path:
            # Summary stats
            summary = {
                "total_countries": len(data),
                "avg_visibility": sum(d['visibility_index'] for d in data) / len(data),
                "bands": {
                    "High": len([d for d in data if d['visibility_index'] >= 80]),
                    "Moderate": len([d for d in data if d['visibility_index'] >= 60 and d['visibility_index'] < 80]),
                    "Low": len([d for d in data if d['visibility_index'] >= 40 and d['visibility_index'] < 60]),
                    "Blind Spot": len([d for d in data if d['visibility_index'] < 40])
                }
            }
            return {
                'statusCode': 200,
                'body': json.dumps(summary)
            }
            
        return {
            'statusCode': 200,
            'body': json.dumps(data),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({"error": str(e)})
        }
