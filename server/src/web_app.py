import json

from flask import Flask, render_template, request, make_response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# list ami a koordinatakat tarolja, a kezdetben ures.
coordinates = []


@app.route("/")
def handle_index():
    """
    Kezeli az index oldalat, elokesziti es visszakulti a html-t a kliensnek.
    :return:
    """
    return render_template("index.html")


@app.route("/coordinates", methods=["GET", "POST", "OPTIONS", "DELETE"])
def handle_coordinates():
    """
    Kezeli a koordinatakat.

    a HTTP GET-re ez az endpint visszaadja az utolso bekuldot koordinatat,
    vagy ures listat, ha meg nincs koordinata.

    a HTTP POST-ra a tarolja a koordinatakat.

    a HTTP OPTIONS-ra csak valaszol, ez kell, hogy egyutt tudjon mukodni a javascript koddal

    a HTTP DELETE pedig torli az ossz tarolt koordinatat
    :return:
    """
    if request.method == "GET":
        response = make_response(json.dumps(coordinates[-1] if coordinates else []))
        response.headers["Content-Type"] = "application/json"
        return response
    if request.method == "POST":
        coordinates.append(json.loads(request.data))
        return "OK"
    if request.method == "OPTIONS":
        return "OK"
    if request.method == "DELETE":
        coordinates.clear()
        return "OK"
    else:
        response = make_response("Method not supported")
        response.status = 405
        return response


@app.route("/coordinates/all", methods=["GET"])
def handle_all_coordinates():
    """
    Kezeli az ossz koordinata lekereset.
    :return:
    """
    response = make_response(json.dumps(coordinates))
    response.headers["Content-Type"] = "application/json"
    return response


# elinditja az appot a localhoston
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8081)
