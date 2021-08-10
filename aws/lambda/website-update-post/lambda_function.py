from pymongo import MongoClient
from bson import ObjectId
import boto3
import json


SECRET_ID = 'mongodb-website'
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
secret_mongodb = get_secret(secret_id=SECRET_ID, region_name=REGION_NAME)
cluster = secret_mongodb['mongodb-cluster']
username = secret_mongodb['mongodb-username']
password = secret_mongodb['mongodb-password']

# MongoDB client
host = f'mongodb+srv://{username}:{password}@{cluster}/{DATABASE}?retryWrites=true&w=majority'
client = MongoClient(host)
collection = client[DATABASE][COLLECTION]


def lambda_handler(event, context):
    # Get data from event
    post_id = event['id']
    new_title = event['title']
    new_category = event['category']
    new_date = event['date']
    new_content = event['content']

    # Update
    update = {
        '$set': {
            'title': new_title,
            'category': new_category,
            'date': new_date,
            'content': new_content
        }
    }
    collection.update_one({'_id': ObjectId(post_id)}, update)
    print(f'Updated document of _id: {post_id}')

    response = {
        'statusCode': 200,
        'body': {
            'message': 'Update successful!'
        }
    }

    return response


if __name__ == '__main__':
    lambda_handler('', '')
