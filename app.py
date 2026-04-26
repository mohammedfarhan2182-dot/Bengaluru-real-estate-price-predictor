from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import pickle
import json
import numpy as np

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Allows frontend to communicate with backend

# Load trained ML model
model = pickle.load(open("model.pkl", "rb"))

# Load column names (features)
data_columns = json.load(open("columns.json"))['data_columns']


# ================= HOME ROUTE =================
@app.route('/')
def home():
    # Renders the HTML page
    return render_template("index.html")


# ================= GET LOCATIONS =================
@app.route('/get_locations')
def get_locations():
    # Send location list to frontend dropdown
    return jsonify({
        'locations': data_columns[3:]
    })


# ================= PREDICTION API =================
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json  # Get JSON data from frontend

        # Extract inputs
        sqft = float(data['sqft'])
        bath = int(data['bath'])
        bhk = int(data['bhk'])
        location = data['location'].lower()

        # Create feature array
        x = np.zeros(len(data_columns))
        x[0] = sqft
        x[1] = bath
        x[2] = bhk

        # One-hot encoding for location
        if location in data_columns:
            x[data_columns.index(location)] = 1

        # Predict price
        price = round(model.predict([x])[0], 2)

        # Categorize price
        if price < 50:
            category = "Budget 🟢"
        elif price < 100:
            category = "Mid Range 🟡"
        else:
            category = "Premium 🔴"

        # Return response
        return jsonify({
            'price': price,
            'category': category
        })

    except Exception as e:
        return jsonify({'error': str(e)})


# ================= RUN SERVER =================
if __name__ == "__main__":
    app.run(debug=True)