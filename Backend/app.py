from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import pickle
import json
import numpy as np
import os
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load model and columns
try:
    with open( "./columns.json", "r") as f:
        data_columns = json.load(f)["data_columns"]
        locations = data_columns[3:]
except (FileNotFoundError, json.JSONDecodeError):
    data_columns, locations = [], []

try:
    with open( "./YTproject.pickle", "rb") as f:
        model = pickle.load(f)
except FileNotFoundError:
    model = None

@app.route('/get_location_names', methods=['GET'])
def get_location_names():
    return jsonify(locations)


@app.route('/predict_price', methods=['POST'])
def predict_price():
    data = request.json
    location = data.get("location", "")
    sqft = float(data.get("sqft", 0))
    bhk = int(data.get("bhk", 0))
    bath = int(data.get("bath", 0))

    try:
        loc_index = data_columns.index(location) if location in data_columns else -1
        print(f"Location: {location}, Sqft: {sqft}, BHK: {bhk}, Bath: {bath}, Loc Index: {loc_index}")
        x = np.zeros(len(data_columns))
        x[0], x[1], x[2] = sqft, bath, bhk
        if loc_index >= 0:
            x[loc_index] = 1

        if model is None:
            print("Error: Model is not loaded.")
            return jsonify({"error": "Model not found"}), 500

        estimated_price = round((model.predict([x])[0]) ,2) # Use DataFrame instead of NumPy array
        print(f"Predicted Price: {estimated_price}")  

        return jsonify({"estimated_price": estimated_price})
    except Exception as e:
        print(f"Error in model prediction: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
