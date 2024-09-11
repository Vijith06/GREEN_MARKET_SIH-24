import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Image, Alert, StatusBar } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App'; // Update the import path if needed
import axios from 'axios';
const IP_ADDRESS = require('../IPAddress.js');

type CLoginProps = {
  navigation: StackNavigationProp<RootStackParamList, 'CLogin'>;
};

const { width } = Dimensions.get('window');

const CLogin: React.FC<CLoginProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    if(email=='')
    {
      Alert.alert('Error', 'Please enter a email address.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Wrong Password', 'Password must be at least 8 characters long.');
      return;
    }

    try {
      const response = await axios.post(`http://${IP_ADDRESS}:3000/login`, { email, password });
      if (response.status === 200) {
        navigation.navigate('CHome');
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        Alert.alert('Login Failed', 'Invalid credentials');
      } else {
        Alert.alert('Error', 'An error occurred while logging in');
      }
    }
  };

  const handleCreateAccount = () => {
    navigation.navigate('Signup');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1B5E20" />
      <Image source={require('./assets/green-market-logo.png')} style={styles.logo} />
      <Text style={styles.title}>Customer Login</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email ID"
          placeholderTextColor="#9E9E9E"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#9E9E9E"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.link} onPress={handleCreateAccount}>
        <Text style={styles.linkText}>Create an Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 20,
  },
  logo: {
    width: 130,
    height: 130,
    marginBottom: 20,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: '#4CAF50',
    backgroundColor: '#FFFFFF',
    padding: 10,
    elevation: 5,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 30,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputContainer: {
    width: width * 0.9,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  input: {
    height: 55,
    borderColor: '#2E7D32',
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#F1F8E9',
    fontSize: 18,
    color: '#212121',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  button: {
    width: width * 0.9,
    height: 55,
    backgroundColor: '#1B5E20',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 7,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  link: {
    marginVertical: 10,
  },
  linkText: {
    color: '#1B5E20',
    fontSize: 17,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default CLogin;
