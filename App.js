// import React, { useState, useEffect } from 'react';
// import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
// import { Audio } from 'expo-av';
// import { StatusBar } from 'expo-status-bar';
// import axios from 'axios';

// const recordingButtonImage = require('./assets/mic.png'); // Replace with your own image path

// export default function App() {
//   const [recording, setRecording] = useState();
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordedAudioURI, setRecordedAudioURI] = useState(null);
//   const [isListening, setIsListening] = useState(false);
//   const [sound, setSound] = useState();

//   useEffect(() => {
//     return sound
//       ? () => {
//           sound.unloadAsync();
//         }
//       : undefined;
//   }, [sound]);

//   useEffect(() => {
//     return () => {
//       if (recording) {
//         stopRecording();
//       }
//     };
//   }, []);

//   const startRecording = async () => {
//     try {
//       setIsListening(true);
//       const { status } = await Audio.requestPermissionsAsync();
//       if (status !== 'granted') {
//         alert('Permission to access microphone is required!');
//         return;
//       }
//       const recordingObject = new Audio.Recording();
//       await recordingObject.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
//       await recordingObject.startAsync();
//       setRecording(recordingObject);
//       setIsRecording(true);
//     } catch (error) {
//       console.error('Failed to start recording', error);
//     }
//   };

//   const stopRecording = async () => {
//     try {
//       setIsRecording(false);
//       setIsListening(false);
//       await recording.stopAndUnloadAsync();
//       const uri = recording.getURI();
//       setRecordedAudioURI(uri);
//     } catch (error) {
//       console.error('Failed to stop recording', error);
//     }
//   };
  

//   const playRecording = async () => {
//     try {
//       if (recordedAudioURI) {
//         const { sound: audioSound } = await Audio.Sound.createAsync({ uri: recordedAudioURI });
//         setSound(audioSound);
//         await audioSound.playAsync();
//       }
//     } catch (error) {
//       console.error('Failed to play recording', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar style="auto" />
//       <Text style={styles.heading}>Audio Recorder</Text>
//       <TouchableOpacity
//         style={styles.recordingButton}
//         onPress={isRecording ? stopRecording : startRecording}
//         disabled={isRecording}
//       >
//         <ImageBackground
//           source={recordingButtonImage}
//           style={styles.buttonImage}
//           resizeMode="contain"
//         />
//       </TouchableOpacity>
//       {recordedAudioURI && (
//         <View style={styles.audioPlayerContainer}>
//           <Text style={styles.audioPlayerText}>Recorded Audio:</Text>
//           <TouchableOpacity style={styles.playButton} onPress={playRecording}>
//             <Text style={styles.playButtonText}>Play</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//       <View>
//         <Text>{isListening ? 'Listening ...' : ''}</Text>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   heading: {
//     fontSize: 20,
//     marginBottom: 20,
//   },
//   recordingButton: {
//     width: 150,
//     height: 150,
//   },
//   buttonImage: {
//     flex: 1,
//     width: undefined,
//     height: undefined,
//   },
//   audioPlayerContainer: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   audioPlayerText: {
//     fontSize: 16,
//     marginBottom: 10,
//   },
//   playButton: {
//     backgroundColor: '#007AFF',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//   },
//   playButtonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
// });

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Platform } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';

const recordingButtonImage = require('./assets/mic.png'); // Replace with your own image path

export default function App() {
  const [recording, setRecording] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioURI, setRecordedAudioURI] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [sound, setSound] = useState();

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    return () => {
      if (recording) {
        stopRecording();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setIsListening(true);
      setRecordedAudioURI(null); // Clear recorded audio URI when starting recording again
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access microphone is required!');
        return;
      }
      const recordingObject = new Audio.Recording();
      await recordingObject.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recordingObject.startAsync();
      setRecording(recordingObject);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      setIsListening(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const savedUri = await saveRecording(uri);
      console.log(savedUri);
      setRecordedAudioURI(savedUri);
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };

  const saveRecording = async (uri) => {
    try {
      const fileExtension = Platform.OS === 'android' ? '.wav' : '.m4a';
      const fileName = `${FileSystem.documentDirectory}recording${fileExtension}`;
      await FileSystem.copyAsync({ from: uri, to: fileName });
      return fileName;
    } catch (error) {
      console.error('Failed to save recording', error);
    }
  };

  const playRecording = async () => {
    try {
      if (recordedAudioURI) {
        const { sound: audioSound } = await Audio.Sound.createAsync({ uri: recordedAudioURI });
        setSound(audioSound);
        await audioSound.playAsync();
      }
    } catch (error) {
      console.error('Failed to play recording', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.heading}>Audio Recorder</Text>
      <TouchableOpacity
        style={styles.recordingButton}
        onPress={isRecording ? stopRecording : startRecording}
        disabled={isRecording}
      >
        <ImageBackground
          source={recordingButtonImage}
          style={styles.buttonImage}
          resizeMode="contain"
        />
      </TouchableOpacity>
      {recordedAudioURI && (
        <View style={styles.audioPlayerContainer}>
          <Text style={styles.audioPlayerText}>Recorded Audio:</Text>
          <TouchableOpacity style={styles.playButton} onPress={playRecording}>
            <Text style={styles.playButtonText}>Play</Text>
          </TouchableOpacity>
        </View>
      )}
      <View>
        <Text>{isListening ? 'Listening ...' : ''}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 20,
    marginBottom: 20,
  },
  recordingButton: {
    width: 150,
    height: 150,
  },
  buttonImage: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
  audioPlayerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  audioPlayerText: {
    fontSize: 16,
    marginBottom: 10,
  },
  playButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
