import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Alert } from "react-native";
import * as Location from "expo-location";
import MapView, { Polyline } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { decode } from "@mapbox/polyline";
import * as geolib from "geolib";
import { GOOGLE_PLACES_API_KEY, GOOGLE_DIRECTIONS_API_KEY } from "@env";

import { ref, onValue } from "firebase/database";
import { realtimeDb } from "../../firebaseConfig";

const sendMessageToSavedContacts = (message) => {
  const dbRef = ref(realtimeDb, "contacts");
  onValue(
    dbRef,
    (snapshot) => {
      const data = snapshot.val() || {};
      Object.keys(data).forEach((phoneNumber) => {
        testSMS(phoneNumber, message);
      });
    },
    {
      onlyOnce: true, // Ensures the listener is triggered once and then removed
    }
  );
};

function testSMS(to, message) {
  fetch("http://10.106.93.50:5001/send_sms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ to, message }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text(); // Use text() here as the response might not be JSON
    })
    .then((text) => {
      try {
        const data = JSON.parse(text); // Safely attempt to parse the text as JSON
        console.log(data);
      } catch (error) {
        console.error("Failed to parse JSON:", error);
      }
    })
    .catch((error) => console.error("Error:", error));
}

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.005;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const AddressScreen = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const [region, setRegion] = useState(null);
  const [lastAlertTime, setLastAlertTime] = useState(true);
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location Permission",
          "Permission to access location was denied"
        );
        return;
      }

      const locationUpdate = async () => {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        const { latitude, longitude } = location.coords;
        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };
        setCurrentLocation(newRegion);
        setRegion(newRegion);

        if (route.length > 0) {
          const nearestPoint = geolib.findNearest(
            { latitude, longitude },
            route
          );
          const nearestPointDistance = geolib.getDistance(
            { latitude, longitude },
            {
              latitude: nearestPoint.latitude,
              longitude: nearestPoint.longitude,
            }
          );

          console.log("Distance from path:", nearestPointDistance);

          const currentTime = Date.now(); //UNUSED: currentTime
          if (nearestPointDistance > 10) {
            const message = `This is an automated message from OnTrack:

Alert: Dheeraj may be lost or in danger, please check in on them. 
              
Last known location: (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`;
            console.log("Deviation Alert");
            sendMessageToSavedContacts(message);
            setLastAlertTime(false);
          }
        }
      };

      // Poll for location updates every 3 seconds
      const intervalId = setInterval(locationUpdate, 5000);

      return () => {
        clearInterval(intervalId);
      };
    })();
  }, [route, lastAlertTime]);

  const fetchDirections = async (originLat, originLong, destination) => {
    const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${originLat},${originLong}&destination=${encodeURIComponent(
      destination
    )}&mode=walking&key=${GOOGLE_DIRECTIONS_API_KEY}`;

    try {
      const response = await fetch(directionsUrl);
      const json = await response.json();
      const points = decode(json.routes[0].overview_polyline.points);
      const coords = points.map((point) => ({
        latitude: point[0],
        longitude: point[1],
      }));
      setRoute(coords);
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  };

  const handleSubmit = (destination) => {
    if (currentLocation) {
      fetchDirections(
        currentLocation.latitude,
        currentLocation.longitude,
        destination
      );
    }
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region} showsUserLocation={true}>
        {route.length > 0 && (
          <Polyline coordinates={route} strokeWidth={4} strokeColor="red" />
        )}
      </MapView>
      <View style={styles.autocompleteContainer}>
        <GooglePlacesAutocomplete
          placeholder="Enter destination"
          fetchDetails={true}
          onPress={(data, details = null) =>
            handleSubmit(details?.formatted_address || data.description)
          }
          query={{
            key: GOOGLE_PLACES_API_KEY, // Use your actual Google Places API key
            language: "en",
          }}
          styles={{ textInput: styles.input }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  autocompleteContainer: {
    marginTop: 30,
    width: "100%",
    position: "absolute",
    top: 10,
    zIndex: 1,
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 5,
  },
});

export default AddressScreen;
