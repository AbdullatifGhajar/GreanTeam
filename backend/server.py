from flask import Flask, jsonify, request

from .analyse import get_overview
from .data import get_available_period

app = Flask(__name__)


@app.route("/login", methods=["get"])
def login():
    # TODO: implement login
    return "not implemented"


@app.route("/overview", methods=["get"])
def overview():
    month = int(request.args.get("month"))
    year = int(request.args.get("year"))
    return jsonify(get_overview(month, year))


@app.route("/available_period", methods=["get"])
def available_period():
    return jsonify(get_available_period())


if __name__ == "__main__":
    app.run(debug=True)
