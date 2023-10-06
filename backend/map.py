import requests

API_KEY = "AIzaSyA0OxIdtp4HAwmRFuIdkep4hKFzL07JZuc"
BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json"


def reverse_geocode(lat, lng):
    endpoint = f"{BASE_URL}?latlng={lat},{lng}&key={API_KEY}"
    response = requests.get(endpoint)
    data = response.json()["results"]

    # Get the most detailed address component
    if len(data) > 0:
        return data[0]["formatted_address"]
    return "Unknown"


lat, lng = 51.351990519429584, 6.2537336505387
print(reverse_geocode(lat, lng))
