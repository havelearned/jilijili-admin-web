import SockJS from 'sockjs-client';
import {Client} from '@stomp/stompjs';

let url = "http://localhost:8080/server"
let socket = undefined;
let stompClient = null;
let connected = false

export default {
    getStompClient() {
        return stompClient;
    },
    createSocket(url, subscribe) {
        socket = new SockJS(url)
        stompClient = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str)
        })
        stompClient.activate();
        stompClient.onConnect = () => {
            connected = true;
            console.log('WebSocket 连接成功');
            // After connection is established, subscribe to topics
            this.subscribe(subscribe);
        };
        stompClient.onStompError = (error) => {
            console.error('WebSocket 连接失败 错误信息=>', error);
        };
    },
    subscribe(to) {
        if (connected) {
            stompClient.subscribe(to, (message) => {
                let result = JSON.parse(message.body)
                // Handle received message
                console.log('服务器=>', result);

            });
        }
    },
    disconnect() {
        if (stompClient) {
            stompClient.deactivate();
            console.log('WebSocket 销毁!');
            connected = false;
        }
    },
    send(destination, message) {
        if (connected) {
            const headers = {}; // Optional headers
            stompClient.publish({destination, headers, body: JSON.stringify(message)});
        }
    }
}

