import pytz
import boto3
from datetime import datetime, timedelta
import pprint


ZONE = 'US/Mountain'
START = datetime.now(tz=pytz.timezone(ZONE)) - timedelta(days=7)
END = datetime.now(tz=pytz.timezone(ZONE))
print(f'Start: {START}, end: {END}')


def lambda_handler(event, context):

    # Cost explorer client
    client = boto3.client('ce')

    # Get tag
    # response = client.get_tags(
    #     TimePeriod={
    #         'Start': START.strftime('%Y-%m-%d'),
    #         'End': END.strftime('%Y-%m-%d')
    #     }
    # )
    # pprint.pprint(response)

    # Get daily cost
    response = client.get_cost_and_usage(
        TimePeriod={
            'Start': START.strftime('%Y-%m-%d'),
            'End': END.strftime('%Y-%m-%d')
        },
        Granularity='DAILY',
        Metrics=['BlendedCost']
    )
    
    dates = []
    costs = []
    for daily_data in response['ResultsByTime']:
        date = daily_data['TimePeriod']['Start']
        dates.append(date)
        cost = daily_data['Total']['BlendedCost']['Amount']
        costs.append(round(float(cost), 2))

    body = {
        'dates': dates,
        'costs': costs
    }
    print('body:')
    pprint.pprint(body)

    return {
        'statusCode': 200,
        'body': body
    }


if __name__ == '__main__':
    print(lambda_handler('', ''))
