import requests
from typing import Optional, Dict, Any

class LocationService:
    @staticmethod
    async def get_location_from_ip(ip_address: str) -> Optional[Dict[str, Any]]:
        """Get location data from IP address using ipapi.co"""
        try:
            response = requests.get(f"http://ipapi.co/{ip_address}/json/", timeout=5)
            if response.status_code == 200:
                data = response.json()
                return {
                    "latitude": data.get("latitude"),
                    "longitude": data.get("longitude"),
                    "city": data.get("city"),
                    "state": data.get("region"),
                    "country": data.get("country_name"),
                    "pincode": data.get("postal")
                }
        except Exception as e:
            print(f"IP location detection failed: {e}")
        return None

    @staticmethod
    async def reverse_geocode(lat: float, lng: float) -> Optional[Dict[str, Any]]:
        """Get address from coordinates using OpenStreetMap Nominatim"""
        try:
            url = f"https://nominatim.openstreetmap.org/reverse"
            params = {
                "lat": lat,
                "lon": lng,
                "format": "json",
                "addressdetails": 1
            }
            headers = {"User-Agent": "HackodishaApp/1.0"}
            
            response = requests.get(url, params=params, headers=headers, timeout=5)
            if response.status_code == 200:
                data = response.json()
                address = data.get("address", {})
                return {
                    "city": address.get("city") or address.get("town") or address.get("village"),
                    "state": address.get("state"),
                    "country": address.get("country"),
                    "pincode": address.get("postcode"),
                    "address": data.get("display_name")
                }
        except Exception as e:
            print(f"Reverse geocoding failed: {e}")
        return None