import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Image
} from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App'; // Update the import path as needed
import { launchImageLibrary, Asset } from 'react-native-image-picker'; // Import image picker

const IP_ADDRESS = require('../IPAddress.js');

type SignupProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Signup'>;
};

const Signup: React.FC<SignupProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null); // State for the selected image
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhoneNumber = (phoneNumber: string) => /^\d{10}$/.test(phoneNumber);

  const validateDOB = (dob: string) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dob);
  };

  const handleSignup = async () => {
    if (name && dob && email && phoneNumber && password && location && imageUri) { // Ensure all fields and imageUri are filled
      if (!validateEmail(email)) {
        Alert.alert('Invalid Email', 'Please enter a valid email address.');
        return;
      }
      if (!validatePhoneNumber(phoneNumber)) {
        Alert.alert('Invalid Phone Number', 'Please enter a valid phone number (10 digits).');
        return;
      }
      if (!validateDOB(dob)) {
        Alert.alert('Invalid DOB', 'Please enter a valid date of birth (YYYY-MM-DD).');
        return;
      }
      if (password.length < 8) {
        Alert.alert('Weak Password', 'Password must be at least 8 characters long.');
        return;
      }

      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('dob', dob);
        formData.append('email', email);
        formData.append('phoneNumber', phoneNumber);
        formData.append('password', password);
        formData.append('location', location);

        if (imageUri) {
          formData.append('image', {
            uri: imageUri,
            type: 'image/jpeg', // Adjust based on your image type
            name: 'profile.jpg', // Set a name for the file
          });
        }

        await axios.post(`http://${IP_ADDRESS}:3000/add-fuser`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        Alert.alert('Signup Successful', 'You have successfully signed up!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('FLogin'),
          },
        ]);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error sending user data:', error.response ? error.response.data : error.message);
          Alert.alert('Signup Failed', 'There was an error signing up. Please try again.');
        } else {
          console.error('Unexpected error:', error);
          Alert.alert('Signup Failed', 'There was an unexpected error. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Incomplete Information', 'Please fill in all fields and upload a photo.');
    }
  };

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const selectedImageUri = response.assets[0].uri ?? null; // Fallback to null if undefined
        setImageUri(selectedImageUri); // Update imageUri state
      }
    });
  };
  
  const handleLoginNavigation = () => {
    navigation.navigate('FLogin');
  };

  return (
    <ImageBackground
      source={{ uri: 'https://www.shutterstock.com/shutterstock/photos/2272118047/display_1500/stock-photo-panoramic-view-of-young-corn-field-plantation-with-sunrise-background-2272118047.jpg' }}
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

        <Text style={styles.label}>DOB</Text>
        <TextInput
          style={styles.input}
          value={dob}
          onChangeText={setDob}
          placeholder="Enter your date of birth (YYYY-MM-DD)"
          placeholderTextColor="#a5d6a7"
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
          placeholder="Enter your phone number (10 digits)"
          placeholderTextColor="#a5d6a7"
          keyboardType="phone-pad"
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

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Enter your location"
          placeholderTextColor="#a5d6a7"
        />

        <TouchableOpacity onPress={handleImagePick} style={styles.imagePicker}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <Text style={styles.imagePlaceholder}>Upload Farmer Card</Text>
          )}
        </TouchableOpacity>

        <Button
          title={loading ? 'Signing Up...' : 'Sign Up'}
          onPress={handleSignup}
          color="#388E3C"
          disabled={loading}
        />

        {loading && <ActivityIndicator size="large" color="#fff" style={styles.loader} />}

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
  imagePicker: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 12,
    borderColor: '#a5d6a7',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  imagePlaceholder: {
    color: '#a5d6a7',
    fontSize: 30,
    fontWeight: '600',
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
  loader: {
    marginVertical: 20,
  },
});

export default Signup;
