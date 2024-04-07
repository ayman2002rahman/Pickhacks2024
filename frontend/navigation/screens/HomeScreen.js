import * as React from 'react';
import { View, Text, Button, Platform } from 'react-native';
import { Audio } from 'expo-av';

function HomeScreen({ navigation }) {
  const [permission, setPermission] = React.useState(false);

  const getMicrophonePermissions = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    setPermission(status === 'granted');
  };

  const startRecording = async () => {
    if (!permission) {
      await getMicrophonePermissions();
    }
    if (permission) {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      
      // Start the recording
      const recording = new Audio.Recording();
      try {
        await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        await recording.startAsync();

        // Split audio into 3-second intervals
        const interval = setInterval(async () => {
          await recording.stopAndUnloadAsync();
          const uri = recording.getURI(); // This is the file path of the recording
          // Here you would send `uri` to your Flask backend
          console.log(uri);

          // Start a new recording for the next segment
          await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
          await recording.startAsync();
        }, 3000);

        // Remember to clear the interval when you navigate away or stop recording
        // clearInterval(interval);

      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 26, fontWeight: 'bold' }}>Home Screen</Text>
      <Button
        title="Go Home"
        onPress={startRecording}
      />
    </View>
  );
}

export default HomeScreen;
