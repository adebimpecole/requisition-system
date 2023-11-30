// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import { getMessaging, onMessage } from 'firebase/messaging';

import {getAuth} from 'firebase/auth';
import {getStorage} from 'firebase/storage';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDFX-z4GfsJzK4Ep_KJd3icXmV7kBka9EM',
  authDomain: 'requisition-system.firebaseapp.com',
  projectId: 'requisition-system',
  storageBucket: 'requisition-system.appspot.com',
  messagingSenderId: '409911220321',
  appId: '1:409911220321:web:9560326b5f9d44e8b17220',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the messaging service
const messaging = getMessaging(app);


// onMessage(messaging, (payload) => {
//   console.log('Message received:', payload);
//   // Customize notification here (e.g., use payload data)
//  });

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
