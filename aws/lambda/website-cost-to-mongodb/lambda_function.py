from pymongo import MongoClient
import pytz
import boto3
from datetime import datetime, timedelta
import json


SECRET_ID = 'mongodb-website'
REGION_NAME = 'us-west-1'
DATABASE = 'node-angular'
COLLECTION = 'cost'
# Upload only yesterday cost to MongoDB
START = datetime.now(tz=pytz.timezone('US/Mountain')) - timedelta(days=1)
END = datetime.now(tz=pytz.timezone('US/Mountain'))
print(f'Start: {START}, end: {END}')


def get_secret(secret_id: str, region_name: str) -> dict:
    session = boto3.session.Session()
    client = session.client(service_name='secretsmanager', region_name=region_name)
    content = client.get_secret_value(SecretId=secret_id)
    secret_string = content['SecretString']
    secret = json.loads(secret_string)
    return secret
    

def lambda_handler(event, context) -> None:
    
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

    # Cost Explorer client
    client_ce = boto3.client('ce')
    
    response = client_ce.get_cost_and_usage(
        TimePeriod={
            'Start': START.strftime('%Y-%m-%d'),
            'End': END.strftime('%Y-%m-%d')
        },
        Granularity='DAILY',
        Metrics=['BlendedCost']
    )
    
    for daily_data in response['ResultsByTime']:
        date = daily_data['TimePeriod']['Start']
        cost = daily_data['Total']['BlendedCost']['Amount']
        collection.insert_one({
            'date': date, 
            'cost': cost
        })
        print(f'Date: {date}, cost: {cost}')
        
    
if __name__ == '__main__':
    print(lambda_handler('', ''))
