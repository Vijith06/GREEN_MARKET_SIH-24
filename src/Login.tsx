import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';

type LoginProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

const { width } = Dimensions.get('window');

const Login: React.FC<LoginProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Green Market</Text>
      
      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('CLogin')}>
        <Image source={require('./assets/customer.png')} style={styles.icon} />
        <Text style={styles.iconText}>Customer</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('FLogin')}>
        <Image source={require('./assets/farmer.jpg')} style={styles.icon} />
        <Text style={styles.iconText}>Farmer</Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#388E3C',
    marginBottom: 50,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: width * 0.7, // Increased width for better size scaling
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 25, // Increased padding for larger icons
    borderRadius: 15,
    marginBottom: 30,
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow for iOS
    shadowOpacity: 0.2, // Shadow for iOS
    shadowRadius: 5, // Shadow for iOS
  },
  icon: {
    width: 100, // Increased width
    height: 100, // Increased height
    marginBottom: 15, // Increased margin
  },
  iconText: {
    fontSize: 20,
    color: '#388E3C',
    fontWeight: '600',
  },
});

export default Login;
