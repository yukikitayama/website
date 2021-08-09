from pymongo import MongoClient
from bson import json_util
import boto3
import json


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

    # Get data from MongoDB
    posts = []
    for post in collection.find():
        # Use json_util for BSON ID
        post = json.loads(json_util.dumps(post))
        # Extract ID string
        post['_id'] = post['_id']['$oid']
        posts.append(post)

    # Return format requirements for API Gateway
    response = {
        'statusCode': 200,
        'body': {
            'message': 'Posts fetched successfull!',
            'posts': posts
        }
    }

    return response


if __name__ == '__main__':
    lambda_handler('', '')
