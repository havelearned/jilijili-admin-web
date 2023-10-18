import SockJS from 'sockjs-client';
import Stomp from 'stompjs';


const sock = new SockJS('http://127.0.0.1:11110/Jnilib');
export const stompClient = Stomp.over(sock);


 const send = () => {
    stompClient.send('/app/notify', {}, 'Hello, server!');
}

 const disconnect = () => {
    stompClient.disconnect(function () {
        console.log('Disconnected from STOMP');
    });
}



