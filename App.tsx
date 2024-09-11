import React, { Component } from 'react';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import NavBar from './src/NavBar';
import Login from './src/Login';
import Signup from './src/Signup';
import Home from './src/Home';
import About from './src/About';
import Contacts from './src/Contact';
import CLogin from './src/CLogin';
import FHome from './src/FHome';
import CHome from './src/CHome';
import FLogin from './src/FLogin';
import FSignup from './src/FSignup';
import { AuthProvider } from './src/AuthContext'; // Adjust path as needed
import Map  from './src/Map'; // Adjust path as needed
import ChatBot from './src/ChatBot';




export type RootStackParamList = {
  Home: undefined;
  About: undefined;
  Contacts: undefined;
  Login: undefined;
  Signup: undefined;
  CLogin: undefined;
  FHome: undefined;
  CHome: undefined;
  FLogin: undefined;
  FSignup: undefined;
  Map: undefined;
  ChatBot :undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

class App extends Component {
  render() {
    return (
      <AuthProvider>
        <NavigationContainer>
          <SafeAreaView style={{ flex: 1 }}>
            <NavBar />
            <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Signup" component={Signup} />
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="About" component={About} />
              <Stack.Screen name="Contacts" component={Contacts} />
              <Stack.Screen name="CLogin" component={CLogin} />
              <Stack.Screen name="FHome" component={FHome} />
              <Stack.Screen name="CHome" component={CHome} />
              <Stack.Screen name="FLogin" component={FLogin} />
              <Stack.Screen name="FSignup" component={FSignup} />
              <Stack.Screen name="Map" component={Map} />
              <Stack.Screen name="ChatBot" component={ChatBot} />




            </Stack.Navigator>
          </SafeAreaView>
        </NavigationContainer>
        </AuthProvider>
    );
  }
}

export default App;
