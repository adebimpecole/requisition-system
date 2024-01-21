
const WebSocket = require('ws');

const admin = require('firebase-admin');

const wss = new WebSocket.Server({ port: 8080 });

const clients = new Map(); // Map to store connected clients with their identifiers

wss.on('connection', async (ws, req) => {
  console.log('A client connected');
  
  // Extracting user ID from the request (for example, query params)
  const userId = req.url.split('/').pop(); // Extract the user ID from the URL

  if (!userId) {
    console.error('No user ID provided');
    ws.close();
    return;
  }

  try {
    // Fetch user data from Firestore based on the provided userId
    const userSnapshot = await admin.firestore().collection('users').doc(userId).get();

    if (!userSnapshot.exists) {
      console.error(`User with ID ${userId} not found in Firestore`);
      ws.close();
      return;
    }

    // Store the client with its provided user ID
    clients.set(userId, ws);

    ws.on('message', (message) => {
      console.log(`Received message from user ${userId}: ${message}`);
      // Additional logic or handling of incoming messages
      ws.send(`Echo: ${message}`);

    });

    ws.on('close', () => {
      console.log(`User ${userId} disconnected`);
      clients.delete(userId); // Remove the client from the Map on disconnect
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    ws.close();
  }
});

console.log('WebSocket server running on port 8080');

module.exports = { wss, clients }; 
