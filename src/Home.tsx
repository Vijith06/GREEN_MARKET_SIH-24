// src/Home.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import IP_ADDRESS from '../IPAddress.js'; // Ensure this exports a string
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App.js'; // Adjust the import path

// Type for navigation prop
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const Home = () => {
  const [images, setImages] = useState<string[]>([]);
  const [displayImages, setDisplayImages] = useState<string[]>([]);
  const defaultImage = 'https://via.placeholder.com/160'; // Default image URL
  const navigation = useNavigation<HomeScreenNavigationProp>(); // Type the navigation prop

  useEffect(() => {
    // Fetch the product data (adjust the URL to your API endpoint)
    const apiUrl = `http://${IP_ADDRESS}:3000/api/products`;

    axios.get(apiUrl)
      .then(response => {
        // Assuming the response contains an array of products with image property
        const fetchedImages = response.data.map((product: any) => product.image || defaultImage);
        setImages(fetchedImages);
        setDisplayImages(getRandomImages(fetchedImages)); // Initialize display images
      })
      .catch(error => {
        console.error('Error fetching product data:', error);
      });
  }, []);

  useEffect(() => {
    // Set up interval to change image set every 5 seconds
    const intervalId = setInterval(() => {
      setDisplayImages(getRandomImages(images)); // Update displayed images
    }, 5000); // Change images every 5000 milliseconds (5 seconds)

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [images]);

  // Function to get a random set of 6 images from the available images
  const getRandomImages = (allImages: string[]) => {
    const shuffled = allImages.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
  };

  // Navigate to CLogin page when an image is clicked
  const handleImagePress = () => {
    navigation.navigate('CLogin');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.text}>Welcome to Green Market!</Text>
      <View style={styles.gridContainer}>
        {displayImages.map((imageUrl, index) => (
          <TouchableOpacity key={index} onPress={handleImagePress}>
            <Image 
              source={{ uri: imageUrl }} // Show image from the current set
              style={styles.image} 
              onError={() => console.error(`Failed to load image: ${imageUrl}`)} // Log error if image fails to load
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 30,
    textAlign: 'center',
    textShadowColor: '#A5D6A7',
    textShadowRadius: 12,
    letterSpacing: 1.5,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#C8E6C9',
    borderRadius: 20,
    elevation: 10, // Enhanced shadow effect
    borderWidth: 1,
    borderColor: '#388E3C',
    width: '100%', // Ensure container takes full width
  },
  image: {
    width: 160,
    height: 160,
    marginBottom: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#81C784',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginHorizontal: 5, // Add margin for spacing
  },
});

export default Home;
