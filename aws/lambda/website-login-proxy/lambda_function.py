from pymongo import MongoClient
import jwt
import boto3
import json
from datetime import datetime, timedelta
import pprint


SECRET_ID_01 = 'mongodb-website'
SECRET_ID_02 = 'authentication-website'
REGION_NAME = 'us-west-1'
DATABASE = 'node-angular'
COLLECTION = 'users'
EXP_MINUTES = 60


def get_secret(secret_id: str, region_name: str) -> dict:
    session = boto3.session.Session()
    client = session.client(service_name='secretsmanager', region_name=region_name)
    content = client.get_secret_value(SecretId=secret_id)
    secret_string = content['SecretString']
    secret = json.loads(secret_string)
    return secret


# Get secret
secret_mongodb = get_secret(secret_id=SECRET_ID_01, region_name=REGION_NAME)
cluster = secret_mongodb['mongodb-cluster']
username = secret_mongodb['mongodb-username']
password = secret_mongodb['mongodb-password']
secret_jwt = get_secret(secret_id=SECRET_ID_02, region_name=REGION_NAME)
key = secret_jwt['jwt-key']


# MongoDB client
host = f'mongodb+srv://{username}:{password}@{cluster}/{DATABASE}?retryWrites=true&w=majority'
client = MongoClient(host)
collection = client[DATABASE][COLLECTION]


def lambda_handler(event, context):

    # Must add this headers to enable CORS for the Lambda proxy integration
    headers = {'Access-Control-Allow-Origin': '*'}
    
    # Get data from frontent
    body = json.loads(event['body'])
    email_from_frontend = body['email']
    password_from_frontend = body['password']

    # Finder a user
    user = collection.find_one({'email': email_from_frontend})

    # If user does not exist, the above returns None
    if not user:
        print('User does not exist')
        return {
            'statusCode': 401,
            'headers': headers,
            'body': json.dumps({
                'message': 'User does not exist'
            })
        }
        
    elif user['password'] != password_from_frontend:
        print('Password is wrong')
        return {
            'statusCode': 401,
            'headers': headers,
            'body': json.dumps({
                'message': 'Password is wrong'
            })
        }
    
    else:
        print('Auth success')
        # Make JWT
        encoded = jwt.encode(
            {
                'email': user['email'],
                'id': str(user['_id']),
                'exp': datetime.utcnow() + timedelta(minutes=EXP_MINUTES)
            },
            key,
            algorithm='HS256'
        )
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'message': 'Auth success',
                'token': encoded,
                'expiresIn': EXP_MINUTES * 60
            })
        }

    
if __name__ == '__main__':
    print(lambda_handler('', ''))
