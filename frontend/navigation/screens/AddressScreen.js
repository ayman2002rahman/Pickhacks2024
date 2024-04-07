import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Alert } from "react-native";
import * as Location from "expo-location";
import MapView, { Polyline } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { decode } from "@mapbox/polyline";
import * as geolib from "geolib";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.005;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const AddressScreen = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const [region, setRegion] = useState(null);
  const [lastAlertTime, setLastAlertTime] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Location Permission", "Permission to access location was denied");
        return;
      }

      const locationUpdate = async () => {
        const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
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
          const nearestPoint = geolib.findNearest({ latitude, longitude }, route);
          const nearestPointDistance = geolib.getDistance(
            { latitude, longitude },
            { latitude: nearestPoint.latitude, longitude: nearestPoint.longitude }
          );

          console.log("Distance from path:", nearestPointDistance);

          const currentTime = Date.now(); //UNUSED: currentTime
          if (nearestPointDistance > 40 && lastAlertTime) {
            //Alert.alert("Deviation Alert", "You have deviated too far from the path.");
            console.log("Deviation Alert");
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
    const apiKey = "AIzaSyBA0O6q2cir2AWdCQP36QnxYJa6LNxsLkU"; // Use your actual Google Directions API key
    const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${originLat},${originLong}&destination=${encodeURIComponent(
      destination
    )}&mode=walking&key=${apiKey}`;

    try {
      const response = await fetch(directionsUrl);
      const json = await response.json();
      const points = decode(json.routes[0].overview_polyline.points);
      const coords = points.map((point) => ({ latitude: point[0], longitude: point[1] }));
      setRoute(coords);
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  };

  const handleSubmit = (destination) => {
    if (currentLocation) {
      fetchDirections(currentLocation.latitude, currentLocation.longitude, destination);
    }
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region} showsUserLocation={true}>
        {route.length > 0 && <Polyline coordinates={route} strokeWidth={4} strokeColor="red" />}
      </MapView>
      <View style={styles.autocompleteContainer}>
        <GooglePlacesAutocomplete
          placeholder="Enter destination"
          fetchDetails={true}
          onPress={(data, details = null) => handleSubmit(details?.formatted_address || data.description)}
          query={{
            key: "AIzaSyBA0O6q2cir2AWdCQP36QnxYJa6LNxsLkU", // Use your actual Google Places API key
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