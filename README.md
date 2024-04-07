# Pickhacks2024
Ayman, Dheeraj, Merrick, and Maanav's submission for Pickhacks 2024!

## Inspiration
Most people in high crime and sketchy areas oftentimes feel unsafe about their solo walks. We wanted to bring forth an app that made people more secure about these walk home back from the work, club, friend's house, etc. by providing a quick alert response system to close family and friends.
![Alt text](https://safetipin.com/wp-content/uploads/2020/06/16x9.jpeg)

## What it does
Walk Secure provides an intuitive way to easily set your route home after a long night out. When something unfortunate happens to you and you steer off your path, your close contacts of family and friends will be automatically notified via text. On top of that, our advanced AI security will detect your cries and struggles for help if someone harasses or makes an attack on you.

## How we built it
- **_React Native_**: main app framework
- **_Google Maps API_**: implements a route data
- **_TensorFlow_**: scream/cry AI detection model
- **_Firebase Realtime Database_**: stores the users contact information
- **_Twilio_**: automatic SMS alert sender
- **_Flask_**: hosts the AI machine learning model and offers endpoints for Twilio

## Challenges we ran into
Our team was very new to the libraries and frameworks we used. We ran into many troubleshooting issues to get all of the app functionalities to work coherently together while we all simultaneously worked on different parts of the app.

## Accomplishments that we're proud of
Getting the app features combined was a major accomplishment. We are also proud that we managed to pull off a useful app that will potentially protect our loved ones.

## What we learned
We became much more familiar with React Native as well as the other tools that we utilized. 

## What's next for Walk Secure
We intend to flesh out the app's kinks to make it much more user friendly and get it ready to publish on the Google Play store and IOS App Store. Let's make everyone more safe!

---

# How to setup and run locally
Activate the virtual environment (venv) before running the application.  
To activate venv, use command `.\venv\Scripts\activate`  

to run app.py: `python -m flask --app .\app.py run`  
