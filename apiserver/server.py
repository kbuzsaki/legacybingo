import json
import os
import random
import subprocess
import sys

from flask import Flask, request, jsonify

GENERATORS_PATH = "../generators/bin"

try:
    VALID_VERSIONS = list(os.listdir(GENERATORS_PATH))
except FileNotFoundError:
    raise Exception("no generators found at '" + GENERATORS_PATH + "', did you build them?")

app = Flask(__name__)

@app.route('/')
def index():
    return "Hello World!"

@app.route('/api/bingo/legacy/card')
def card():
    version = request.args.get("version", "v9.2")
    seed = request.args.get("seed", random.randint(0, 10000))

    # validate version
    if version not in VALID_VERSIONS:
        return jsonify(error="unknown version: '" + str(version) + "'")

    # validate seed
    try:
        seed = int(seed)
    except ValueError:
        return jsonify(error="invalid seed: '" + str(seed) + "'")

    try:
        card = generate_card(version, seed)
        return jsonify(goals=card, seed=seed, version=version)
    except Exception as e:
        raise e
        return jsonify(error=str(e))

def generate_card(version, seed):
    generator = GENERATORS_PATH + "/" + version
    command = [generator, str(seed), "--json"]

    try:
        card_json = subprocess.check_output(command).decode("utf8")
        card = json.loads(card_json)

        # skip the first entry because it's empty and I'd rather not change the old generators
        card = card[1:]

        return card
    except Exception as e:
        raise e
        raise Exception("something went wrong generating the card")

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1")
