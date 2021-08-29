import random
import json


def lambda_handler(event, context):
    
    intercept = float(event['queryStringParameters']['intercept'])
    slope = float(event['queryStringParameters']['slope'])
    count = int(event['queryStringParameters']['count'])
    
    data = [intercept + x * slope + random.uniform(-1, 1) for x in range(count)]
    [print(x) for x in data]
    
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'data': data
        })
    }
    
    
if __name__ == '__main__':
    event = {
        'queryStringParameters': {
            'intercept': 10,
            'slope': -1,
            'count': 50
        }
    }
    print(lambda_handler(event, ''))
