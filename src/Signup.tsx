import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ImageBackground, TouchableOpacity, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App'; // Update import path as needed
const IP_ADDRESS = require('../IPAddress.js');

type SignupProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Signup'>; // Adjust based on your stack navigator
};

const Signup: React.FC<SignupProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhoneNumber = (phoneNumber: string) => /^[0-9]{10}$/.test(phoneNumber); // Adjust pattern as needed
  const isValidPassword = (password: string) => password.length >= 8;
  const isValidDOB = (dob: string) => {
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
    if (!dobRegex.test(dob)) return false;
    
    const date = new Date(dob);
    return date instanceof Date && !isNaN(date.getTime());
  };

  const handleSignup = () => {
    if (!name || !dob || !password || !email || !phoneNumber || !location) {
      Alert.alert('Incomplete Information', 'Please fill in all fields');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number.');
      return;
    }

    if (!isValidPassword(password)) {
      Alert.alert('Invalid Password', 'Password must be at least 8 characters long.');
      return;
    }

    if (!isValidDOB(dob)) {
      Alert.alert('Invalid Date of Birth', 'Please enter a valid date in YYYY-MM-DD format.');
      return;
    }

    axios.post(`http://${IP_ADDRESS}:3000/add-user`, { name, dob, password, email, phoneNumber, location })
      .then(() => {
        Alert.alert('Signup Successful', 'You have successfully signed up!', [
          {
            text: 'OK',
            onPress: () => {
              // Optionally navigate to another screen or clear form fields
              navigation.navigate('CLogin'); // Navigate to login screen after signup
            },
          },
        ]);
      })
      .catch(error => {
        console.error('Error sending user data:', error.response ? error.response.data : error.message);
        Alert.alert('Signup Failed', 'There was an error signing up. Please try again.');
      });
  };

  const handleLoginNavigation = () => {
    navigation.navigate('CLogin');
  };

  return (
    <ImageBackground
      source={{ uri: 'https://www.shutterstock.com/shutterstock/photos/2272118047/display_1500/stock-photo-panoramic-view-of-young-corn-field-plantation-with-sunrise-background-2272118047.jpg' }} // Replace with a green natural background image URL
      style={styles.background}
      blurRadius={4}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Join Green Market</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="#a5d6a7"
        />

        <Text style={styles.label}>DOB (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          value={dob}
          onChangeText={setDob}
          placeholder="Enter your date of birth"
          placeholderTextColor="#a5d6a7"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          placeholderTextColor="#a5d6a7"
          secureTextEntry
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor="#a5d6a7"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Enter your phone number"
          placeholderTextColor="#a5d6a7"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Enter your location"
          placeholderTextColor="#a5d6a7"
        />

        <Button title="Sign Up" onPress={handleSignup} color="#388E3C" />

        <TouchableOpacity style={styles.loginLink} onPress={handleLoginNavigation}>
          <Text style={styles.loginLinkText}>If you have an account, login</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    height: 1000,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'rgba(0, 128, 0, 0.7)',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#fff',
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#a5d6a7',
    padding: 10,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#fff',
  },
  loginLink: {
    marginVertical: 20,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Signup;
