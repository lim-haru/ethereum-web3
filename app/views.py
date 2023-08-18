from django.shortcuts import render, redirect
from .coinmarketcap import price
from django.core.paginator import Paginator
from .events import get_events

def home(request):
    # get crypto price
    btc = price('BTC')
    eth = price('ETH')
    bnb = price('BNB')
    sol = price('SOL')

    # get all events
    events = get_events()
    txs = 0

    for event in events:
        txs += 1

    context = {
        'btc': btc,
        'eth': eth,
        'bnb': bnb,
        'sol': sol,

        'txs': txs,
        'events': events[:3],
    }
    return render(request, 'home.html', context)

def token(request):
    return render(request, 'token.html')

def send(request):
    return render(request, 'send.html')

def mint(request):
    return render(request, 'mint.html')

def earn(request):
    return render(request, 'earn.html')

def event(request):
    # get all events
    events = get_events()
    
    # implementing pagination for event listing
    paginator = Paginator(events, 15)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, 'event.html', {'page_obj': page_obj})
