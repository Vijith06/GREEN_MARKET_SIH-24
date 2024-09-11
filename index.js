import { AppRegistry } from 'react-native';
import App from './App'; // Ensure the path is correct
import { name as appName } from './app.json'; // Ensure the path is correct

AppRegistry.registerComponent(appName, () => App);
