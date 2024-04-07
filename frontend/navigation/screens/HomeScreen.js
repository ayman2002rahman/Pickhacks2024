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
    // const recordSegment = async () => {
   //   const recording = new Audio.Recording();
   //   try {
   //     await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
   //     await recording.startAsync();
   //     // Wait for 3 seconds
   //     await new Promise(resolve => setTimeout(resolve, 3000));
   //     await recording.stopAndUnloadAsync();
   //     // Get the URI of the recorded segment
   //     const uri = recording.getURI();
   //     console.log(uri);
   //     // Here, you can also add code to upload the file to your server
   //   } catch (error) {
   //     console.error("Error during recording: ", error);
   //   }
   // };


   const recordSegment = async () => {
     const recording = new Audio.Recording();
     try {
       await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
       await recording.startAsync();
       // Wait for 3 seconds
       await new Promise(resolve => setTimeout(resolve, 3000));
       await recording.stopAndUnloadAsync();
       // Get the URI of the recorded segment
       const uri = await recording.getURI(); // Ensure this is awaited if it returns a promise
       console.log(uri);
  
       // Prepare to upload the file
       const formData = new FormData();
       // Depending on your URI, adjust the path as necessary
       formData.append('audio', { uri, name: 'segment.wav', type: 'audio/x-wav'});
      
       // Replace <your-flask-server-ip> with your actual server IP address
       fetch('http://10.106.54.21:5000/upload_audio', {
         method: 'POST',
         body: formData,
         headers: {
           'Content-Type': 'multipart/form-data',
         },
       })
       .then(response => response.json())
       .then(data => console.log(data))
       .catch(error => console.error("Error uploading file:", error));
  
       // Here, you can also add code to handle the server response
  
     } catch (error) {
       console.error("Error during recording: ", error);
     }
   };


   // const recordSegment = async () => {
   //   let recording = new Audio.Recording();
   //   try {
   //     await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
   //     await recording.startAsync();
   //     // Wait for 3 seconds
   //     await new Promise(resolve => setTimeout(resolve, 3000));
   //     await recording.stopAndUnloadAsync();
   //     // Check and ensure the URI exists
   //     const uri = await recording.getURI();
   //     if (!uri) {
   //       console.error("Recording failed, URI is null");
   //       return;
   //     }
   //     console.log(uri);
   //     // Further processing, such as uploading the recording
   //   } catch (error) {
   //     console.error("Error during recording: ", error);
   //   } finally {
   //     // Dispose of the recording
   //     recording = null;
   //   }
   // };
  
  
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

