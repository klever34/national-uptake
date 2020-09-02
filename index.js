import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import AsyncStorage from '@react-native-community/async-storage';
var PushNotification = require('react-native-push-notification');   

PushNotification.configure({
  onRegister: async function(token) {
    console.log('TOKEN:', token.token);
    await AsyncStorage.setItem('@firebase_token', token.token)
  },
  onNotification: function(notification) {
    console.log('NOTIFICATION:', notification);
    // notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
  onAction: function(notification) {
    console.log('ACTION:', notification.action);
    console.log('NOTIFICATION:', notification);
  },
  onRegistrationError: function(err) {
    console.error(err.message, err);
  },
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: Platform.OS === 'ios',
});

AppRegistry.registerComponent(appName, () => App);
