from flask import Flask, render_template, request, jsonify
from datetime import date, datetime
import uuid

app = Flask(__name__)

ROUTES = [
    {'mode':'bus','operator':'Orange Express','from':'Hyderabad','to':'Bengaluru','departure':'21:30','arrival':'06:15','duration':'8h 45m','price':899,'seats':18,'type':'AC Sleeper','rating':4.7},
    {'mode':'bus','operator':'Skyline Travels','from':'Hyderabad','to':'Bengaluru','departure':'22:15','arrival':'07:00','duration':'8h 45m','price':749,'seats':12,'type':'AC Seater','rating':4.5},
    {'mode':'bus','operator':'CityLink Premium','from':'Hyderabad','to':'Vijayawada','departure':'07:00','arrival':'12:30','duration':'5h 30m','price':499,'seats':24,'type':'AC Seater','rating':4.6},
    {'mode':'bus','operator':'Night Rider','from':'Bengaluru','to':'Chennai','departure':'23:00','arrival':'05:30','duration':'6h 30m','price':699,'seats':16,'type':'Sleeper','rating':4.4},
    {'mode':'train','operator':'Vande Bharat Express','number':'20701','from':'Hyderabad','to':'Vijayawada','departure':'06:00','arrival':'10:35','duration':'4h 35m','price':1250,'seats':42,'type':'AC Chair Car','rating':4.9},
    {'mode':'train','operator':'Kacheguda Express','number':'12785','from':'Hyderabad','to':'Bengaluru','departure':'19:05','arrival':'06:15','duration':'11h 10m','price':680,'seats':38,'type':'3A','rating':4.6},
    {'mode':'train','operator':'Chennai Express','number':'12604','from':'Hyderabad','to':'Chennai','departure':'17:10','arrival':'05:55','duration':'12h 45m','price':790,'seats':28,'type':'3A','rating':4.5},
    {'mode':'train','operator':'Shatabdi Express','number':'12028','from':'Bengaluru','to':'Chennai','departure':'06:00','arrival':'11:00','duration':'5h','price':980,'seats':30,'type':'Chair Car','rating':4.8},
]
BOOKINGS = {}  # Demo only: stored in memory, reset on restart.

@app.get('/')
def home():
    return render_template('index.html', today=date.today().isoformat())

@app.get('/api/search')
def search():
    mode = request.args.get('mode', 'bus').lower()
    origin = request.args.get('from', '').strip().lower()
    destination = request.args.get('to', '').strip().lower()
    travel_date = request.args.get('date', '')
    if mode not in ('bus', 'train') or not origin or not destination or origin == destination:
        return jsonify(error='Choose different departure and arrival cities.'), 400
    try:
        selected_date = date.fromisoformat(travel_date)
        if selected_date < date.today():
            return jsonify(error='Choose today or a future travel date.'), 400
    except ValueError:
        return jsonify(error='Enter a valid travel date.'), 400
    results = [{**route, 'id': str(i)} for i, route in enumerate(ROUTES)
               if route['mode'] == mode and route['from'].lower() == origin and route['to'].lower() == destination]
    return jsonify(results=results, count=len(results))

@app.post('/api/book')
def book():
    data = request.get_json(silent=True) or {}
    try:
        route_id = int(data.get('route_id', -1))
        route = ROUTES[route_id]
        travel_date = date.fromisoformat(str(data.get('date', '')))
        name = str(data.get('name', '')).strip()
        email = str(data.get('email', '')).strip()
        passengers = int(data.get('passengers', 1))
        if travel_date < date.today() or not name or '@' not in email or not 1 <= passengers <= 6 or passengers > route['seats']:
            raise ValueError('Invalid booking details')
    except (ValueError, TypeError, IndexError, KeyError):
        return jsonify(error='Check your name, email, date and passenger count.'), 400
    booking_id = 'TG-' + uuid.uuid4().hex[:8].upper()
    booking = {'booking_id': booking_id, 'route': route, 'date': travel_date.isoformat(),
               'name': name, 'email': email, 'passengers': passengers, 'total': passengers * route['price']}
    BOOKINGS[booking_id] = booking
    return jsonify(booking=booking), 201

@app.get('/health')
def health():
    return jsonify(status='ok')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
