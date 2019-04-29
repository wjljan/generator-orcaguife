import io from 'socket.io-client';
import {notification} from 'antd';
import {socketEventChannel, socketEventCode, eventCodeForEventChannel} from './conf';
import httpRequests from 'Http/requests';

const socket = io();

// pre-configs
const {
    test
} = eventCodeForEventChannel;

// no progress business operations message after initialization and login
socket.on('event status', async ({channel, code, target, result, notify}) => {
    if (process.env.NODE_ENV === 'development'){
        console.info('%c ws message(event status): ', 'color: #00CC00', 'channel:', channel, ', code:', code, ', target:',target, ', result:', result, ', notify:', notify);
    }
    const inInitialized = getSystemStatusInCookie('init');
    if (inInitialized){
        try {
            if (notify){
                notification[result ? 'success' : 'warning']({
                    message: socketEventChannel[channel]() + '通知',
                    description: socketEventCode[code](target, result)
                });
            }
        } catch (e){
            console.info('WebSocket message notification error: ' + e);
        }
    }

    /*
     * Special Codes Handlers
     * Sometimes we receive a websocket message from server, and notification isn't the only thing
     * we need to do. There are some other important logic we should execute depend on the message code.
     */

    // example codes:

    /*** test channel ***/

    // get value
    if (test.includes(code)){
        httpRequests.getValue();
    }

});

/*
// connect error
socket.on('connect_error', ({type, description}) => {
    console.info(`%c WebSocket client loses the connection with server, type: ${type}, code: ${description}`, 'color: #CC0033');
});
*/

// attempt to reconnect
socket.on('reconnect_attempt', attemptNumber => {
    console.info(`%c WebSocket client is attempting to reconnect server. Attempt number is ${attemptNumber}.`, 'color: #CC9900');
});

// reconnect successfully
socket.on('reconnect', attemptNumber => {
    cronJob.runPlaybook();
    console.clear();
    console.info(`%c WebSocket client reconnects to server successfully! Attempt number is ${attemptNumber}.`, 'color: #00CC00');
});

// reconnect attempt error
socket.on('reconnect_error', ({type, description}) => {
    cronJob.pausePlaybook();
    console.info(`%c WebSocket client reconnects to server error, type: ${type}, code: ${description}`, 'color: #CC0033');
});

// reconnect attempt failed
socket.on('reconnect_failed', ({type, description}) => {
    console.info(`%c WebSocket client reconnects to server failed, type: ${type}, code: ${description}`, 'color: #CC0033');
});