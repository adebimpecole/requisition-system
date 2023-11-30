import { useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: 'AIzaSyDFX-z4GfsJzK4Ep_KJd3icXmV7kBka9EM',
    authDomain: 'requisition-system.firebaseapp.com',
    projectId: 'requisition-system',
    storageBucket: 'requisition-system.appspot.com',
    messagingSenderId: '409911220321',
    appId: '1:409911220321:web:9560326b5f9d44e8b17220',
  };

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

const FirebaseCloudMessaging = () => {
  useEffect(() => {
    // Request permission for receiving notifications
    messaging
      .requestPermission()
      .then(() => {
        console.log('Notification permission granted.');
      })
      .catch((error) => {
        console.error('Unable to get permission to notify.', error);
      });

    // Handle incoming messages when the app is in the foreground
    const unsubscribe = onMessage((payload) => {
      console.log('Message received. ', payload);

      // Update your React state or display a notification to the user
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return null; // You can return a component if needed
};

export default FirebaseCloudMessaging;
