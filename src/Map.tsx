import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, PermissionsAndroid, Platform, Alert, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const Map: React.FC = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [manualLocation, setManualLocation] = useState<{ latitude: string; longitude: string }>({
    latitude: '',
    longitude: '',
  });
  const [inputAddress, setInputAddress] = useState<string>(''); // For user to enter the physical address

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestLocationPermission();
    } else {
      fetchLocation();
    }
  }, []);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission Required',
          message: 'This app needs to access your location to provide map functionality.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        fetchLocation();
      } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
        Alert.alert('Permission Denied', 'Location permission is required to access your location.');
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        Alert.alert('Permission Denied', 'You have denied location permission permanently. Please enable it in the app settings.');
      }
    } catch (err) {
      console.warn('Permission request error:', err);
    }
  };

  const fetchLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        fetchAddressFromCoordinates(latitude, longitude);
      },
      (error) => {
        handleLocationError(error);
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 1000 } // Increased timeout duration
    );
  };

  const handleLocationError = (error: { code: number; message: string }) => {
    switch (error.code) {
      case 1:
        Alert.alert('Permission Denied', 'Permission to access location was denied.');
        break;
      case 2:
        Alert.alert('Position Unavailable', 'The location could not be determined.');
        break;
      case 3:
        Alert.alert('Timeout', 'The location request timed out. Please try again.');
        break;
      default:
        Alert.alert('Error', 'An unknown error occurred while fetching location.');
        break;
    }
    console.error('Error fetching location:', error);
  };

  const fetchAddressFromCoordinates = async (latitude: number, longitude: number) => {
    const apiKey = 'YOUR_GOOGLE_API_KEY'; // Replace with your actual Google API Key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results.length > 0) {
        const formattedAddress = data.results[0].formatted_address;
        setAddress(formattedAddress);
      } else {
        setAddress('Address not found');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  const handleManualLocationSubmit = () => {
    const { latitude, longitude } = manualLocation;
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        setLocation({ latitude: lat, longitude: lng });
        fetchAddressFromCoordinates(lat, lng);
      } else {
        Alert.alert('Invalid Input', 'Please enter valid numeric values for latitude and longitude.');
      }
    }
  };

  const handleAddressSubmit = async () => {
    const apiKey = process.env.OPENAI_API_KEY; // Replace with your actual Google API Key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(inputAddress)}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        setLocation({ latitude: lat, longitude: lng });
        setAddress(data.results[0].formatted_address);
      } else {
        Alert.alert('Location not found', 'Unable to find the location for the given address.');
      }
    } catch (error) {
      console.error('Error fetching coordinates from address:', error);
      Alert.alert('Error', 'Failed to fetch coordinates. Please check your internet connection and try again.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {location ? (
        <View style={{ flex: 1 }}>
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker coordinate={location} />
          </MapView>
          {address && <Text style={{ padding: 10 }}>Location: {address}</Text>}
        </View>
      ) : (
        <View style={{ padding: 20 }}>
          <Text>Enter an address or coordinates to find a location:</Text>
          <TextInput
            placeholder="Enter Physical Address (e.g., 1600 Amphitheatre Parkway, Mountain View, CA)"
            value={inputAddress}
            onChangeText={setInputAddress}
            style={{ borderBottomWidth: 1, marginBottom: 20 }}
          />
          <Button title="Submit Address" onPress={handleAddressSubmit} />

          <TextInput
            placeholder="Enter Latitude (e.g., 37.7749)"
            value={manualLocation.latitude}
            onChangeText={(text) => setManualLocation({ ...manualLocation, latitude: text })}
            keyboardType="numeric"
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />
          <TextInput
            placeholder="Enter Longitude (e.g., -122.4194)"
            value={manualLocation.longitude}
            onChangeText={(text) => setManualLocation({ ...manualLocation, longitude: text })}
            keyboardType="numeric"
            style={{ borderBottomWidth: 1, marginBottom: 20 }}
          />
          <Button title="Submit Coordinates" onPress={handleManualLocationSubmit} />
        </View>
      )}
    </View>
  );
};

export default Map;
