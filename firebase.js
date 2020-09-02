import firebase from '@react-native-firebase/app';

var firebaseConfig = {
  apiKey: 'AIzaSyBdbXyhLdMfc3kUYPDYvz-SiVrdZkpetS0',
  authDomain: 'nationaluptake.firebaseapp.com',
  databaseURL: 'https://nationaluptake.firebaseio.com/',
  projectId: 'nationaluptake',
  storageBucket: 'nationaluptake.appspot.com',
  messagingSenderId: '897006572508',
  appId: '1:897006572508:android:7bddd89ae170c2149ff519',
};

if (!firebase.apps.length) {
  firebase.initializeApp({apiKey: 'AIzaSyBdbXyhLdMfc3kUYPDYvz-SiVrdZkpetS0'});
}

const Firebase = firebase.initializeApp(firebaseConfig);
export default Firebase;
