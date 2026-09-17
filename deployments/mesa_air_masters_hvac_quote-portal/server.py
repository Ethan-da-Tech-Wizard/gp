from flask import Flask, jsonify, request
app = Flask(__name__)

@app.route('/api/lead', methods=['POST'])
def receive_lead():
    data = request.json
    print(f"[NEW LEAD RECEIVED FOR Mesa Air Masters HVAC]: {data}")
    # Run phone validation, DB save, and SMS dispatch trigger here
    return jsonify({"status": "success", "message": "Lead dispatched to Mesa Air Masters HVAC board"})

if __name__ == '__main__':
    app.run(port=5000)
