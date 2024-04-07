import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import for navigation

// Assuming you have a separate SafeTravel.js file

export default function HomeScreen() {
  const navigation = useNavigation(); // Get navigation reference

  // Function to handle audio recording (replace with your actual implementation)
  const handleStartRecording = async () => {
    // Request microphone permission (if needed on your platform)
    const hasPermission = await requestMicrophonePermission(); // Implement permission handling

    if (hasPermission) {
      // Start recording logic using a suitable audio recording library
      console.log('Starting audio recording...'); // Placeholder for actual recording

      // Optionally, navigate to SafeTravel.js after a recording duration or on user interaction
      //navigation.navigate('SafeTravel', { recordingData: /* recorded audio data */ }); // Pass data if needed
    } else {
      console.warn('Microphone permission denied.'); // Handle permission denial
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 26, fontWeight: 'bold' }}>Home Screen</Text>
      <Button title="Start Safe Travel Recording" onPress={handleStartRecording} />
    </View>
  );
}

// Microphone permission request function (example, adjust based on your platform)
async function requestMicrophonePermission() {
    const { status } = await Permissions.askAsync(Permissions.MICROPHONE);
    return status === 'granted';
  }