import requests, os
from requests.exceptions import ConnectionError, Timeout, TooManyRedirects
from pprint import pprint
from dotenv import load_dotenv

# Load .env file
load_dotenv()

def price(symbol, convert='USD'):
    url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest'
    parameters = {
        'symbol': symbol,
        'convert': convert
    }
    headers = {
        'Accepts': 'application/json',
        'X-CMC_PRO_API_KEY': os.environ.get('COINMARKETCAP_API_KEY'),
    }
    r = requests.get(url=url, headers=headers, params=parameters).json()

    currencies = r['data']
    price = currencies[symbol]['quote'][convert]['price']
    percentChange24h = currencies[symbol]['quote'][convert]['percent_change_24h']

    return price, percentChange24h
