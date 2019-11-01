import urllib.request as req
from http.client import HTTPResponse
import json

# innen tolti le a koordinatakat
COORDINATES_URL = "https://kommuna.club/coordinates"


def fetch_coordinates(url):
    """
    Letolti a koordinatakat az adott cimrol. A visszaadott ertek GeoJSON specifikalt json.
    :return: JSON GeoJSON specifikaciok serint.
    """
    return json.loads(req.urlopen(url).read())


def main():
    coordinates = fetch_coordinates(COORDINATES_URL)
    print(coordinates)


if __name__ == "__main__":
    main()
