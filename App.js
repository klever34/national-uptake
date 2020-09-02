import React from 'react';
import {
  StyleSheet,
  StatusBar,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {AuthContext} from './context';

import Login from './src/screens/login/index';
import Register from './src/screens/register/index';
import Password from './src/screens/password/index';

import Welcome from './src/screens/welcome/index';

import Available from './src/screens/available/index';
import Profile from './src/screens/profile/index';
import {connect} from 'react-redux';
import AnimatedSplash from 'react-native-animated-splash-screen';
import messaging from '@react-native-firebase/messaging';
import Firebase from './firebase';
import PushNotification from 'react-native-push-notification';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {baseUrl} from './src/constants/index';
import Change from './src/screens/change/index';
import Confirm from './src/screens/confirm/index';
import Credit from './src/screens/credit/index';
import Details from './src/screens/details/index';
import Email from './src/screens/email/index';
import Enteries from './src/screens/enteries/index';
import Ereset from './src/screens/ereset/index';
import History from './src/screens/history/index';
import Home from './src/screens/home/index';
import Hoq from './src/screens/hoq/index';
import Namings from './src/screens/namings/index';
import Support from "./src/screens/support";
import Refer from "./src/screens/refer";
import Refer2 from "./src/screens/refer2";
import Notify from "./src/screens/notify";
import Udetails from "./src/screens/udetails";
import Suc from "./src/screens/success";
import Udetails2 from "./src/screens/udetails2";
import Win from "./src/screens/win";
import Story from "./src/screens/story";
// // import Camera from "./src/screens/camera";
import Web from "./src/screens/Web";
import Faq from "./src/screens/Faq";
import Invoice from "./src/screens/Invoice";
import Won from "./src/screens/won";
import Test from "./src/screens/Test";
import Newreset from "./src/screens/newreset";
import Pay from "./src/screens/pay";
import Payment from "./src/screens/payment";
import Promo from "./src/screens/promo";
import Reset2 from "./src/screens/reset2";
import Reset from "./src/screens/reset";



const AuthStack = createStackNavigator();
const AuthStackScreen = () => (
  <AuthStack.Navigator headerMode="none">
    <AuthStack.Screen name="Welcome" component={Welcome} />
    <AuthStack.Screen
      name="Login"
      component={Login}
      options={{title: 'Login'}}
    />
    <AuthStack.Screen name="Register" component={Register} />
    <AuthStack.Screen name="Password" component={Password} />
    <AuthStack.Screen name="Available" component={Available} />
  </AuthStack.Navigator>
);

const OtherStack = createStackNavigator()
const OtherStackScreen = () => (
  <OtherStack.Navigator headerMode="none">
    <OtherStack.Screen name="Available" component={Available} />
    <OtherStack.Screen name="Change" component={Change} />
    <OtherStack.Screen
      name="Confirm"
      component={Confirm}
    />
    <OtherStack.Screen name="Credit" component={Credit} />
    <OtherStack.Screen name="Details" component={Details} />
    <OtherStack.Screen name="Email" component={Email} />
    <OtherStack.Screen name="Enteries" component={Enteries} />
    <OtherStack.Screen name="Ereset" component={Ereset} />
    <OtherStack.Screen name="History" component={History} />
    <OtherStack.Screen name="Home" component={Home} />
    <OtherStack.Screen name="Hoq" component={Hoq} />
    <OtherStack.Screen name="Namings" component={Namings} />
    <OtherStack.Screen name="Support" component={Support} />
    <OtherStack.Screen name="Refer" component={Refer} />
    <OtherStack.Screen name="Refer2" component={Refer2} />
    <OtherStack.Screen name="Profile" component={Profile} />
    <OtherStack.Screen name="Notify" component={Notify} />
    <OtherStack.Screen name="Udetails" component={Udetails} />
    <OtherStack.Screen name="Suc" component={Suc} />
    <OtherStack.Screen name="Udetails2" component={Udetails2} />
    <OtherStack.Screen name="Reset2" component={Reset2} />
    <OtherStack.Screen name="Pay" component={Pay} />
    <OtherStack.Screen name="Story" component={Story} />
    <OtherStack.Screen name="Win" component={Win} />
    <OtherStack.Screen name="Web" component={Web} />
    <OtherStack.Screen name="Faq" component={Faq} />
    <OtherStack.Screen name="Invoice" component={Invoice} />
    <OtherStack.Screen name="Won" component={Won} />
    <OtherStack.Screen name="Test" component={Test} />
    <OtherStack.Screen name="Newreset" component={Newreset} />
    
    <OtherStack.Screen name="Payment" component={Payment} />
    <OtherStack.Screen name="Promo" component={Promo} />
    <OtherStack.Screen name="Reset" component={Reset} />
  </OtherStack.Navigator>
);

const RootStack = createStackNavigator();
const RootStackScreen = ({userToken}) => (
  <RootStack.Navigator headerMode="none">
    {userToken ? (
      <RootStack.Screen
        name="App"
        component={OtherStackScreen}
        options={{
          animationEnabled: false,
        }}
      />
    ) : (
      <RootStack.Screen
        name="Auth"
        component={AuthStackScreen}
        options={{
          animationEnabled: false,
        }}
      />
    )}
  </RootStack.Navigator>
);

const App = () => {
  const [userToken, setUserToken] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [userStatus, setUserStatus] = React.useState(null);
  const [splash, setSplash] = React.useState(false);
  const [chosenTheme, setChosenTheme] = React.useState(0);

  React.useEffect(() => {
    async function getToken() {
      const token = await AsyncStorage.getItem('@firebase_token');
      console.log(token);
      try {
        const response = await axios.post(
          `${baseUrl}/api/notifications/savetoken`,
          {
            userId:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImRlZjRlNGMzLWI0NGUtNDIzZS1hMmJiLTE1MDQ0OTBjMWEwNyIsInJvbGUiOiJDdXN0b21lciIsIm5iZiI6MTU5ODcxMTU3OCwiZXhwIjoxNTk5MzE5OTc4LCJpYXQiOjE1OTg3MTE1Nzh9.3abpOh0qkpsRhRJSOLmN-4hQaQsxdJxeHpiSEVTcnpw',
            token: token,
          },
        );

        console.log(response.data);
      } catch (error) {
        console.log(error.response);
      }
    }
    getToken();
  }, []);

  React.useEffect(() => {
    async function requestUserPermission() {
      const settings = await messaging().requestPermission();
    }
    requestUserPermission();
  }, []);

  React.useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      PushNotification.localNotification({
        id: 0, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
        title: 'My Notification Title', // (optional)
        message: 'My Notification Message', // (required)
        userInfo: {}, // (optional) default: {} (using null throws a JSON value '<null>' error)
        soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
        number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
      });
    });
  });

  React.useEffect(() => {
    async function checkUserStatus() {
      setIsLoading(true);
      try {
        const value = await AsyncStorage.getItem('@user_onboarded');
        if (value) {
          setUserStatus(value);
        } else {
          setUserStatus(null);
        }
      } catch (e) {}
    }
    checkUserStatus();
  }, []);

  React.useEffect(() => {
    setTimeout(() => {
      setSplash(true);
    }, 3000);
  }, []);

  const authContext = React.useMemo(() => {
    return {
      signIn: async () => {
        try {
          const value = await AsyncStorage.getItem('@user_token');
          if (value !== null) {
            setUserToken(value);
          } else {
            setUserToken(null);
          }
        } catch (e) {}
      },
      signUp: async () => {
        try {
          const value = await AsyncStorage.getItem('@user_token');
          if (value !== null) {
            setUserToken(value);
          } else {
            setUserToken(null);
          }
        } catch (e) {}
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem('@user_token');
          setUserToken(null);
        } catch (e) {}
      },
      onboarded: async () => {
        try {
          const value = await AsyncStorage.getItem('@user_onboarded');
          if (value) {
            setUserStatus(value);
          } else {
            setUserStatus(null);
          }
        } catch (e) {}
      },
    };
  }, []);

  React.useEffect(() => {
    async function getToken() {
      setIsLoading(true);
      try {
        const value = await AsyncStorage.getItem('@user_token');
        if (value !== null) {
          setIsLoading(false);
          setUserToken(value);
        } else {
          setIsLoading(false);
          setUserToken(null);
        }
      } catch (e) {}
    }
    getToken();
  }, []);

  if (userStatus === 'true') {
    if (Platform.OS === 'ios') {
      return (
        <>
          <StatusBar barStyle="dark-content" />
          <AuthContext.Provider value={authContext}>
            <NavigationContainer>
              <RootStackScreen userToken={userToken} />
            </NavigationContainer>
          </AuthContext.Provider>
        </>
      );
    } else {
      return (
        <AnimatedSplash
          translucent={true}
          isLoaded={splash}
          logoImage={require('./src/assets/images/merged.png')}
          backgroundColor={'#fff'}
          logoHeight={300}
          logoWidht={300}>
          <>
            <StatusBar barStyle="dark-content" />

            <AuthContext.Provider value={authContext}>
              <NavigationContainer>
                <RootStackScreen userToken={userToken} />
              </NavigationContainer>
            </AuthContext.Provider>
          </>
        </AnimatedSplash>
      );
    }
  }
  return (
    <AnimatedSplash
      translucent={true}
      isLoaded={splash}
      logoImage={require('./src/assets/images/merged.png')}
      backgroundColor={'#fff'}
      logoHeight={300}
      logoWidht={300}>
      <AuthContext.Provider value={authContext}>
      <NavigationContainer>

        <Welcome />
        </NavigationContainer>
      </AuthContext.Provider>
    </AnimatedSplash>
  );
};

const styles = StyleSheet.create({});

export default App;
