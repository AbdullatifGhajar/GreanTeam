from flask import Flask, jsonify, request

from .analyse import get_overview

app = Flask(__name__)


@app.route("/login", methods=["get"])
def login():
    # TODO: implement login
    return "not implemented"


@app.route("/overview", methods=["get"])
def overview():
    return jsonify(get_overview())


if __name__ == "__main__":
    app.run(debug=True)
