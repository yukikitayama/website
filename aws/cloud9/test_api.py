import requests
import pprint


URL = 'https://el4z1kjt48.execute-api.us-west-1.amazonaws.com/test'


r = requests.get(
    url=f'{URL}/data?slope=1&intercept=-1&count=50'
)
pprint.pprint(r.json())

[print(x) for x in r.json()['data']]



