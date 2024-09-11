// src/About.tsx
import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

const About = () => {
  return (
    <ImageBackground
      source={{ uri: 'https://www.shutterstock.com/shutterstock/photos/2272118047/display_1500/stock-photo-panoramic-view-of-young-corn-field-plantation-with-sunrise-background-2272118047.jpg' }} // Replace with a suitable background image
      style={styles.background}
      blurRadius={4}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>About Green Market</Text>
        <Text style={styles.text}>
          Green Market is a pioneering initiative that empowers farmers by directly connecting them with consumers and retailers. 
          Our platform fosters a transparent, sustainable, and fair marketplace where quality produce meets genuine demand. 
          By cutting out middlemen, we ensure that farmers receive a fair price for their hard work while consumers enjoy fresh, locally-sourced products. 
          Together, we’re cultivating a community-driven economy that values integrity, sustainability, and mutual growth.
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    height:1000,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(34, 139, 34, 0.7)', // Enhanced green overlay with better contrast
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
    borderRadius: 15,
    margin: 10,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#FFEB3B', // Bright yellow for contrast
    marginBottom: 25,
    textAlign: 'center',
  },
  text: {
    fontSize: 20,
    color: '#FAFAFA', // Light text for contrast
    textAlign: 'center',
    lineHeight: 30,
    paddingHorizontal: 10,
  },
});

export default About;
