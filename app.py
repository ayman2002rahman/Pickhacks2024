from flask import Flask, jsonify, request
from flask_cors import CORS
from twilio.rest import Client
import os

app = Flask(__name__)
CORS(app)

@app.route("/", methods = ['GET'])
def get_articles():
    return jsonify({"Hello":"World"})

# ACCOUNT_SID = os.getenv('ACCOUNT_SID')
# AUTH_TOKEN = os.getenv('AUTH_TOKEN')
# TWILIO_NUMBER = os.getenv('TWILIO_NUMBER')

ACCOUNT_SID = 'AC41c03ebecd0d0ae9c960eeb3082ec407'
AUTH_TOKEN = '402f5b2391598ec151f27d1394732519'
TWILIO_NUMBER = '+18449504817'

#twilio 
@app.route('/send_sms', methods=['POST'])
def send_sms():
    # Extract the message and recipient number from the request
    print("We made it")
    data = request.json
    to_number = data.get('to')
    message_body = data.get('message')
    print("Request successfull")

    if not to_number or not message_body:
        return jsonify({'error': 'Missing data'}), 400

    # Initialize the Twilio client
    client = Client(ACCOUNT_SID, AUTH_TOKEN)

    print(client)

    # Send the SMS
    try:
        message = client.messages.create(
            body=message_body,
            from_=TWILIO_NUMBER,
            to=to_number
        )
        return jsonify({'message': 'SMS sent successfully', 'sid': message.sid}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# if __name__ == "__main__":
#     app.run()

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001)
