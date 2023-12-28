importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: 'AIzaSyDFX-z4GfsJzK4Ep_KJd3icXmV7kBka9EM',
    authDomain: 'requisition-system.firebaseapp.com',
    projectId: 'requisition-system',
    storageBucket: 'requisition-system.appspot.com',
    messagingSenderId: '409911220321',
    appId: '1:409911220321:web:9560326b5f9d44e8b17220',
    vapidKey: "BPXbpkufprC3AFZQbeoZyETcwXdUex2SPwkJ0wlb37NfDRP43tHb55k9gybAJRqmePfJjtpq8azkZV2pIE_XgBM",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
