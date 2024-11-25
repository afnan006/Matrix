from flask import Flask, request, jsonify
from flask_cors import CORS
from database import init_db, add_activity, get_daily_summary

app = Flask(__name__)
CORS(app)

# Initialize the database
init_db()

@app.route('/api/activity', methods=['POST'])
def log_activity():
    data = request.json
    add_activity(data['intent'], data['task'], data['duration'])
    return jsonify({"status": "success"}), 200

@app.route('/api/summary', methods=['GET'])
def get_summary():
    summary = get_daily_summary()
    return jsonify(summary), 200

if __name__ == '__main__':
    app.run(debug=True)

