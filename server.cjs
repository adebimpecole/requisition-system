const express = require('express');
const admin = require('firebase-admin');
const path = require('path');

const app = express();
const { wss, clients } = require('./websocketServer.cjs'); // Import WebSocket variables

require('./websocketServer.cjs'); // Import WebSocket server instance

const INTERVAL_TIME = 10000; // 10 seconds

app.use(express.json());

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

app.post('/users/:theUser/pending', (req, res) => {
  const { theUser } = req.params; // Extract theUser from URL params
  const { reqId } = req.body; // Assuming reqId is part of the request body
  
  console.log(`New request (${reqId}) for user: ${theUser}`);

  const connectedClient = clients.get(theUser);

  if (connectedClient) {
    connectedClient.send(JSON.stringify({ type: 'new_request', requestId: reqId }));
    res.status(200).json({ message: `Request sent to user: ${theUser}` });
  } else {
    res.status(404).json({ error: `User ${theUser} not connected` });
  }
 
  res.status(200).json({message: `Request for user with ID ${userId}`});
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

// Handle any other requests by serving the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
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


