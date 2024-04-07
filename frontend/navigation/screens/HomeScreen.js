import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { Audio } from 'expo-av';

function HomeScreen({ navigation }) {
    const [permission, setPermission] = React.useState(false);
  
    React.useEffect(() => {
      (async () => {
        const { status } = await Audio.requestPermissionsAsync();
        setPermission(status === 'granted');
      })();
    }, []);
  
    const recordSegment = async () => {
      const recording = new Audio.Recording();
      try {
        await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        await recording.startAsync();
        // Wait for 3 seconds
        await new Promise(resolve => setTimeout(resolve, 3000));
        await recording.stopAndUnloadAsync();
        // Get the URI of the recorded segment
        const uri = recording.getURI();
        console.log(uri);
        // Here, you can also add code to upload the file to your server
      } catch (error) {
        console.error("Error during recording: ", error);
      }
    };
  
    const startSegmentedRecording = async (duration, interval) => {
      const startTime = Date.now();
      const recordNextSegment = async () => {
        if (Date.now() - startTime < duration) {
          await recordSegment();
          setTimeout(recordNextSegment, interval);
        }
      };
      recordNextSegment();
    };
  
    const startRecording = () => {
      if (!permission) {
        console.log('Microphone permission is required.');
        return;
      }
      // Start segmented recording for a total duration of 30 seconds, with each segment being 3 seconds long
      startSegmentedRecording(30000, 3000);
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