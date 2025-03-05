import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private stompClient: Client;

  constructor() {
    // Initialize the STOMP client
    this.stompClient = new Client({
      brokerURL: 'ws://your-backend-url/websocket', // WebSocket endpoint
      reconnectDelay: 5000, // Reconnect delay in case of connection failure
      debug: (str) => {
        console.log(str); // Optional: Log STOMP debug messages
      },
    });

    // Connect to the WebSocket server
    this.stompClient.onConnect = (frame) => {
      console.log('Connected to WebSocket');
      this.stompClient.subscribe('/topic/noise-level', (message) => {
        const noiseLevel = JSON.parse(message.body).level;
        console.log('Received noise level:', noiseLevel);
        // Emit this noiseLevel to your component (e.g., using a Subject or BehaviorSubject)
      });
    };

    // Handle connection errors
    this.stompClient.onStompError = (frame) => {
      console.error('WebSocket error:', frame.headers['message']);
    };

    // Activate the STOMP client
    this.stompClient.activate();
  }

  // Optional: Disconnect the WebSocket
  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      console.log('WebSocket disconnected');
    }
  }
}