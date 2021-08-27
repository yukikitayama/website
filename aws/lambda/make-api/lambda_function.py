import json
import random


def lambda_handler(event, context):
    
    # Get query string parameters
    slope = event['queryStringParameters']['slope']
    intercept = event['queryStringParameters']['intercept']
    count = event['queryStringParameters']['count']

    # Generate data
    data = [round(float(slope) * x + float(intercept) + random.uniform(-1, 1), 1) for x in range(int(count))]
    [print(x) for x in data]
    
    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'data': data
        })
    }
    
    
if __name__ == '__main__':
    event = {
        'queryStringParameters': {
            'slope': '-0.3',
            'intercept': '3',
            'count': '100'
        }
    }
    event = {
        'queryStringParameters': {
            'slope': '',
            'intercept': '',
            'count': ''
        }
    }
    print(lambda_handler(event, ''))


