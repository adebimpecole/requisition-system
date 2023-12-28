// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';


// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDFX-z4GfsJzK4Ep_KJd3icXmV7kBka9EM',
  authDomain: 'requisition-system.firebaseapp.com',
  projectId: 'requisition-system',
  storageBucket: 'requisition-system.appspot.com',
  messagingSenderId: '409911220321',
  appId: '1:409911220321:web:9560326b5f9d44e8b17220',
  vapidKey: "BPXbpkufprC3AFZQbeoZyETcwXdUex2SPwkJ0wlb37NfDRP43tHb55k9gybAJRqmePfJjtpq8azkZV2pIE_XgBM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Register service worker
navigator.serviceWorker.register('/firebase-messaging-sw.js')
  .then((registration) => {
    console.log('Service worker registered with scope:', registration.scope);
  })
  .catch((error) => {
    console.error('Service worker registration failed:', error);
  });


export const publicKey = "BPXbpkufprC3AFZQbeoZyETcwXdUex2SPwkJ0wlb37NfDRP43tHb55k9gybAJRqmePfJjtpq8azkZV2pIE_XgBM";
const privateKey = "5At6ksxbW0QZteSkkvICLcx4VLbz7a0QCxBa4serezA";

export const auth = getAuth(app);
export const storage = getStorage(app);

// Request notification permission from the user
Notification.requestPermission()
 .then((status) => {
    console.log('Notification permission status:', status);
    if (status === 'granted') {
      console.log('Notification permission granted.');
      // Get the token
      return getToken(messaging);
    } else {
      console.log('Unable to get permission to notify.');
    }
 })
 .then((token) => {
    console.log('Token:', token);
    // Send the token to your server here
 });

export const getFCMToken = async () => {
  let token;

  try {
    token = await getToken(messaging);
    if (token) {
      console.log('FCM token:', token);
    } else {
      console.log('No Instance ID token available. Request permission to generate one.');
      // request permission to generate token
      await Notification.requestPermission();
      token = await getToken(messaging);
      console.log('FCM token after requesting permission:', token);
    }
  } catch (error) {
    console.log('An error occurred while retrieving token. ', error);
  }

  return token;
};

export const updateFCMToken = async (token) => {
  let refreshedToken = await getToken(messaging);
    if (refreshedToken == token) {
      return null
    }
    else{
      return refreshedToken
    }
  
};

export const sendTokenToBackend = (userId, token) => {
  // Make an API call to the backend server  
  const payload = {
    userId: userId,
    fcmToken: token
  };

  console.log(payload)

  fetch('http://localhost:5000/api/storeFcmToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('FCM Token sent to backend successfully:', data);
  })
  .catch(error => {
    console.error('There was a problem sending the FCM Token:', error);
  });
};

export { app, messaging, getToken, onMessage };
export default app;
