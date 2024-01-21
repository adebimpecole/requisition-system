import { useEffect } from 'react';

function useWebSocket(userId) {
    useEffect(() => {
        const socket = new WebSocket(`ws://localhost:8080/${userId}`);

        socket.onopen = () => {
            console.log('WebSocket connection established');
            // Perform actions upon successful connection
            // Example: socket.send('Hello, WebSocket Server!');
        };

        socket.onmessage = (event) => {
            console.log('Received message:', event.data);
            // Handle incoming messages from the WebSocket server
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
            // Handle WebSocket connection close event
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            // Handle WebSocket errors
        };

        return () => {
            socket.close();
        };
    }, [userId]);
}

export default useWebSocket;
