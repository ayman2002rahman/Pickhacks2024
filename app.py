from flask import Flask, jsonify, request
from flask_cors import CORS
from twilio.rest import Client
from werkzeug.utils import secure_filename
import os
from scream import detectScream


app = Flask(__name__)
CORS(app)


@app.route("/", methods = ['GET'])
def get_articles():
   return jsonify({"Hello":"World"})


# ACCOUNT_SID = os.getenv('ACCOUNT_SID')
# AUTH_TOKEN = os.getenv('AUTH_TOKEN')
# TWILIO_NUMBER = os.getenv('TWILIO_NUMBER')


ACCOUNT_SID = 'AC44ed71c48f6770b3cc0fb410a851c3e9'
AUTH_TOKEN = 'ca45abdfb45a30ce27cb9c1fd1737c5e'
TWILIO_NUMBER = '+18557203385'


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


@app.route('/upload_audio', methods=['POST'])
def upload_audio():
   if 'audio' not in request.files:
       return jsonify({'error': 'No audio file part'}), 400
   file = request.files['audio']
   if file.filename == '':
       return jsonify({'error': 'No selected file'}), 400
   if file:
       # Log the content type of the received file
       print('Content-Type:', file.content_type)
       filename = file.filename
       file.save(os.path.join('frontend/audio-uploads', filename))
       # After saving, you can call your scream detection function here
       print(f'frontend/audio-uploads/{filename}')
       detectScream(f'frontend/audio-uploads/{filename}')
       return jsonify({'message': 'File uploaded successfully'}), 200


# if __name__ == "__main__":
#     app.run()


if __name__ == "__main__":
   app.run(host='0.0.0.0', port=5000)

