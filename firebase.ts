
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDxcvcZv_GNJ_otXrJD3ppts3qSrO2fmVk",
  authDomain: "appticketreactnative.firebaseapp.com",
  projectId: "appticketreactnative",
  storageBucket: "appticketreactnative.appspot.com",
  messagingSenderId: "453633078217",
  appId: "1:453633078217:web:53de367e504dceea24ae18",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth, db };

