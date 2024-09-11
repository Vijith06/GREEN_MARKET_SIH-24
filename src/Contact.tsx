import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Linking } from 'react-native';

// Background image URL (replace with your own image if needed)
const backgroundImage = 'https://www.shutterstock.com/shutterstock/photos/2272118047/display_1500/stock-photo-panoramic-view-of-young-corn-field-plantation-with-sunrise-background-2272118047.jpg';

const Contacts = () => {
  return (
    <ImageBackground 
      source={{ uri: backgroundImage }} 
      style={styles.background} 
      blurRadius={6} // Added blur effect
    >
      <View style={styles.container}>
        <Text style={styles.title}>Contact Us</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Email:</Text>
          <TouchableOpacity onPress={() => Linking.openURL('mailto:support@greenmarket.com')}>
            <Text style={styles.cardText}>support@greenmarket.com</Text>
          </TouchableOpacity>
          <Text style={styles.cardTitle}>Phone:</Text>
          <TouchableOpacity onPress={() => Linking.openURL('tel:+91 99447 93030')}>
            <Text style={styles.cardText}>+91 9944793030</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    height:1000,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    elevation: 5, // For Android shadow effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#00796B',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 21,
    color: '#004D40',
    marginBottom: 15,
  },
});

export default Contacts;
