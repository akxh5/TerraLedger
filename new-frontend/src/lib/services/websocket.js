import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let sharedClient = null;
let subscribers = new Map();  // Use Map with unique IDs for proper dedup
let isConnecting = false;
let subscriberIdCounter = 0;

export const createWebSocketClient = (onMessageReceived) => {
    // Generate a unique subscriber ID
    const subscriberId = ++subscriberIdCounter;

    if (onMessageReceived) {
        subscribers.set(subscriberId, onMessageReceived);
    }

    if (!sharedClient && !isConnecting) {
        isConnecting = true;
        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws-terraledger'),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('Connected to Shared WebSocket');
                isConnecting = false;
                client.subscribe('/topic/events', (message) => {
                    subscribers.forEach(cb => cb(message.body));
                });
            },
            onStompError: (frame) => {
                console.error('STOMP error', frame);
                isConnecting = false;
                sharedClient = null;
            },
            onDisconnect: () => {
                console.log('Disconnected from Shared WebSocket');
                isConnecting = false;
                sharedClient = null;
            }
        });

        sharedClient = client;
        sharedClient.activate();
    }

    return {
        deactivate: () => {
            subscribers.delete(subscriberId);
            if (subscribers.size === 0 && sharedClient) {
                const clientToDeactivate = sharedClient;
                sharedClient = null;
                isConnecting = false;
                try {
                    clientToDeactivate.deactivate();
                } catch (e) {
                    console.error('Error deactivating WebSocket', e);
                }
            }
        }
    };
};
