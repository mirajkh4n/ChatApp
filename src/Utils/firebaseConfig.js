import { firebase } from '@react-native-firebase/app';
import database from '@react-native-firebase/database'; 

const firebaseConfig = {
  apiKey: 'AIzaSyBqQC82Bv89aWOXapYk0GHbMyKVrSOYgDU', 
  authDomain: 'chatapp-12d75.firebaseapp.com',     
  databaseURL: 'https://chatapp-12d75.firebaseio.com', 
  projectId: 'chatapp-12d75',                      
  storageBucket: 'chatapp-12d75.appspot.com',       
  messagingSenderId: '648395161917',              
  appId: '1:648395161917:android:647b31b3bfe56aef2d4554', 
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const databaseRef = database().ref(); 

export { databaseRef };  
