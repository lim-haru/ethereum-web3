from web3 import Web3
from dotenv import load_dotenv
import os, json
from datetime import datetime

# Load .env file
load_dotenv()

def get_events():
    w3 = Web3(Web3.HTTPProvider(os.environ.get('WEB3_PROVIDER')))

    contract_address = "0x346E6993E6Fa30826CFcabb509D95363475108cA"

    # Load the ABI from the JavaScript file
    with open('static/js/tToken_abi.js', 'r') as abi_file:
        abi_content = abi_file.read()

    # Extract the contents of the tokenABI variable from the file
    abi_start = abi_content.find("[")
    abi_end = abi_content.rfind("]") + 1
    contract_abi = json.loads(abi_content[abi_start:abi_end])

    contract = w3.eth.contract(address=contract_address, abi=contract_abi)

    contract_events = contract.events.Transfer().get_logs(fromBlock=0)

    events = []

    for contract_event in contract_events:
        event = {}
        block = w3.eth.get_block(contract_event['blockNumber'])

        event['timestamp'] = datetime.utcfromtimestamp(block.timestamp)
        event['from'] = contract_event['args']['from']
        event['to'] = contract_event['args']['to']
        event['value'] = int(contract_event['args']['value']) / (10 ** 18)
        if event['from'] == '0x0000000000000000000000000000000000000000':
            event['event'] = 'Mint'
        else:
            event['event'] = contract_event['event']

        events.insert(0, event)

    return events
