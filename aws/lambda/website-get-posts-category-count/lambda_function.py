from pymongo import MongoClient
from bson.son import SON
import boto3
import json
import pprint


SECRET_ID_01 = 'mongodb-website'
REGION_NAME = 'us-west-1'
DATABASE = 'node-angular'
COLLECTION = 'posts'


def get_secret(secret_id: str, region_name: str) -> dict:
    session = boto3.session.Session()
    client = session.client(service_name='secretsmanager', region_name=region_name)
    content = client.get_secret_value(SecretId=secret_id)
    secret_string = content['SecretString']
    secret = json.loads(secret_string)
    return secret


# Get secrets
secret_mongodb = get_secret(secret_id=SECRET_ID_01, region_name=REGION_NAME)
cluster = secret_mongodb['mongodb-cluster']
username = secret_mongodb['mongodb-username']
password = secret_mongodb['mongodb-password']

# MongoDB client
host = f'mongodb+srv://{username}:{password}@{cluster}/{DATABASE}?retryWrites=true&w=majority'
client = MongoClient(host)
db = client[DATABASE]
collection = db[COLLECTION]


def lambda_handler(event, context):
    
    # Get number of posts by category
    pipeline = [
        {
            '$group': {
                '_id': '$category',
                'count': {'$sum': 1}
            }
        },
        {
            '$sort': SON([('count', -1), ('_id', 1)])
        }
    ]
    results = collection.aggregate(pipeline)

    # Extract data from Mongo cursor    
    data = []
    for result in list(results):
        category = result['_id']
        count = result['count']
        data.append({
            'category': category,
            'count': count
        })

    # Return format requirements of API Gateway
    response = {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'message': 'Post count by category fetched successfully!',
            'data': data
        })
    }

    return response


if __name__ == '__main__':
    print(lambda_handler('', ''))
