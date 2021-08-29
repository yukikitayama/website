import requests

API_URL = 'invoke_url_in_api_gateway'

response = requests.get(
    url=f'{API_URL}/data?intercept=10&slope=-0.5&count=50'
)
[print(data) for data in response.json()['data']]

print(f'Status code: {response.status_code}')
print(f'Data: {response.json()}')