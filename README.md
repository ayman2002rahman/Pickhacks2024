# Pickhacks2024
Ayman, Dheeraj, Merrick, and Maanav's submission for Pickhacks 2024!

## Inspiration
Most people in high crime and sketchy areas oftentimes feel unsafe about their solo walks. We wanted to bring forth an app that made people more secure about these walk home back from the work, club, friend's house, etc. 
![Alt text](https://safetipin.com/wp-content/uploads/2020/06/16x9.jpeg)

## What it does
OnTrack provides an intuitive way to easily set your route home after a long night out. When something unfortunate happens to you and you steer off your path, your close contacts of family and friends will be automatically notified via text., On top of that, advanced AI security will detect your cries and struggles for help if someone harasses or violently acts on you.

## How we built it
Frontend: Utilizing React Native, we crafted a seamless mobile interface for our safety application, enriched by the dynamic capabilities of Expo for smooth operation across various smartphone platforms. This interface is designed to allow users to swiftly navigate through safety features, monitor their location in real-time, and manage emergency contact settings effortlessly.

Backend: Our safety solution begins with the  use of a finely tuned YAMNet model, a depthwise-separable convolution neural network known for its sound classification. This AI/ML model is adept at distinguishing distress signals, such as screams, amidst ambient noise by leveraging the smartphone's microphone to capture audio. Upon detecting a scream, our system promptly consults the Firebase Realtime Database to retrieve the user's designated emergency contacts. Subsequently, we employ Twilio's  SMS capabilities to dispatch alert messages to these contacts, ensuring immediate notification in times of distress.

Navigation & Safety Monitoring: The cornerstone of our application is the integration of Google Maps API, which not only furnishes a detailed map for navigation but also calculates the user's distance from their designated safe route. Should the user deviate beyond a predetermined threshold distance, our system activates a safety protocol akin to the scream detection mechanism. This includes retrieving emergency contacts from the database and employing Twilio to send out SMS alerts, thereby providing a comprehensive safety net for users navigating their way home.

Our backend architecture is powered by Python's Flask framework, chosen for its seamless integration with our TensorFlow-based YAMNet model. This synergy between Flask and TensorFlow enables real-time processing and classification of sounds, forming the backbone of our application's alert system. Through this innovative fusion of AI/ML models, cloud databases, and SMS notification services, we offer users a vigilant companion that enhances their safety and peace of mind during nightly walks.

## Challenges we ran into
- We were unfamiliar with the libraries and frameworks
- We switched from Kotlin android development and using React-Native and Flask midway
- Networking errors between phone and computer
- Using the I/O of the user's phone effectively
- Interfacing between front and back end
- The git merge conflicts with 4 people trying to work on the same codebase at the same time

## Accomplishments that we're proud of
Getting a cohesive product despite all the struggles and time crunches was a major accomplishment. Most of our team are beginners, and despite not being experts in the frameworks and libraries that we used,  we managed to power through and learn by doing. We are very proud to showcase the product of our hard work and sleeplessness. 

## What we learned
We learnt about using the native components of  the device with react-native through the implementation of our app. Things like using the on device microphone, gps location, and accessing the contacts list. We honed our skills in connecting the React Native frontend with a backend like Flask, and adeptly incorporating Firebase database into our application. Working with an AI and fine tuning it for our scream detection feature was very fun too. 

## What's next for OnTrack
- Improve accuracy and response time of screaming detection
- Make app more intuitive and user friendly so that it is ready for deployment on the Google Play store and IOS App Store!
- Personal Defense Training Integration: plans to offer educational resources within the app. This could include short video tutorials or safety tips specifically relevant to walkers.

---

# How to setup and run locally
Activate the virtual environment (venv) before running the application.  
To activate venv, use command `.\venv\Scripts\activate`  

to run app.py: `python -m flask --app .\app.py run`  
