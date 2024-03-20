import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { Audio } from 'expo-av';
import {StatusBar} from 'expo-status-bar'
import axios from 'axios';

const recordingButtonImage = require('./assets/mic.png'); // Replace with your own image path

export default function App() {
  const [recording, setRecording] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [islistening, setIsListening] = useState(false)

  useEffect(() => {
    return () => {
      if (recording) {
        stopRecording();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setIsListening(true)
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
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      // uploadAudio(uri);
    } catch (error) {
    }
    console.error('Failed to stop recording', error);
  };

  const uploadAudio = async (uri) => {
    try {
      const formData = new FormData();
      formData.append('audio', {
        uri,
        type: 'audio/x-wav',
        name: 'audio.wav',
      });

      const response = await axios.post('YOUR_API_ENDPOINT', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Audio uploaded successfully!', response.data);
    } catch (error) {
      console.error('Failed to upload audio', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style='auto' />
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
      <View>
      <Text >{islistening ? "listening .....":""}</Text>
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
});
