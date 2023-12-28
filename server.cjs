const express = require('express');
const admin = require('firebase-admin');
const path = require('path');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
 });

app.use(express.static(path.join(__dirname, 'dist'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
    if (path.endsWith('.mjs')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Serve service worker file with the correct MIME type
app.get('./firebase-messaging-sw.js', (req, res) => {
  res.header('Content-Type', 'application/javascript');
  res.sendFile('firebase-messaging-sw.js');
});

// Handle any other requests by serving the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.use(express.json()); 

//Handles requests for a specific user based on their ID
app.post('http://localhost:5000/users/:theUser/pending', (req, res) => {
  const { userId, reqId } = req.body; 
  console.log(`You have a new request bitch!!! ${reqId}`)

  // res.send(`Request for user with ID ${userId}`);
  res.status(200).send(`Request for user with ID ${userId}`);

});

// Endpoint to handle FCM token from frontend
app.post('/api/storeFcmToken', (req, res) => {
  const { userId, fcmToken } = req.body;

  console.log(`Received FCM token ${fcmToken} for user ${userId}`);

  res.status(200).json({ message: `Received FCM token ${fcmToken} for user ${userId}` });
});

// Endpoint to handle new requests
app.post('/api/newRequest', (req, res) => {
  // Handle POST requests to '/api/newRequest'
  const { userId, reqId } = req.body;

  // Process the incoming message
  // ... (perform actions based on the message)

  res.status(200).json({ success: true, message: `Received request from ${userId} with id ${reqId}`});
});



// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Firebase Admin Configuration
const serviceAccount = require('./requisition-system-firebase-adminsdk-do62v-6654b41437.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://requisition-system-default-rtdb.firebaseio.com',
});


