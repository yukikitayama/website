from pymongo import MongoClient
import pytz
import boto3
from datetime import datetime, timedelta
import json
import pprint


SECRET_ID = 'mongodb-website'
REGION_NAME = 'us-west-1'
DATABASE = 'node-angular'
COLLECTION = 'cost'


def get_secret(secret_id: str, region_name: str) -> dict:
    session = boto3.session.Session()
    client = session.client(service_name='secretsmanager', region_name=region_name)
    content = client.get_secret_value(SecretId=secret_id)
    secret_string = content['SecretString']
    secret = json.loads(secret_string)
    return secret
    
    
# Get secret
secret_mongodb = get_secret(secret_id=SECRET_ID, region_name=REGION_NAME)
cluster = secret_mongodb['mongodb-cluster']
username = secret_mongodb['mongodb-username']
password = secret_mongodb['mongodb-password']

# MongoDB client
host = f'mongodb+srv://{username}:{password}@{cluster}/{DATABASE}?retryWrites=true&w=majority'
client_mongo = MongoClient(host)
db = client_mongo[DATABASE]
collection = db[COLLECTION]


def lambda_handler(event, context):
    
    # Get request date
    start = event['queryStringParameters']['startDate']
    end = event['queryStringParameters']['endDate']
    print(f'Start: {start}, end: {end}')
    
    query = {
        'date': {
            '$gte': start,
            '$lte': end
        }
    }
    
    dates = []
    costs = []
    for doc in collection.find(query):
        # pprint.pprint(doc)
        date = doc['date']
        dates.append(date)
        cost = doc['cost']
        costs.append(cost)
        
    # CORS header for Lambda proxy integration
    headers = {
        'Access-Control-Allow-Origin': '*'
    }
    
    response = {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({
            'dates': dates,
            'costs': costs
        })
    }
    
    return response
    
    
if __name__ == '__main__':
    start_date = datetime.now(tz=pytz.timezone('US/Mountain')) - timedelta(days=8)
    end_date = datetime.now(tz=pytz.timezone('US/Mountain')) - timedelta(days=1)
    event = {
        'queryStringParameters': {
            'startDate': start_date.strftime('%Y-%m-%d'),
            'endDate': end_date.strftime('%Y-%m-%d')
        }
    }
    print(lambda_handler(event, ''))