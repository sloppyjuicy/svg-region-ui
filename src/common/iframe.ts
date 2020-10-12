import type { HashMap } from "./types";

export interface FrameMessage {
    type: 'backoffice';
    action: 'update' | 'metadata';
    name?: string;
    status?: 'success' | 'error';
    content: HashMap;
}

export function isChildFrame() {
    return window.parent !== window;
}

export function sendMessage(msg: FrameMessage) {
    return new Promise((resolve, reject) => {
        if (isChildFrame()) {
            window.parent.postMessage(JSON.stringify(msg), '*');
            const onMessage = (m) => {
                if (typeof m.data !== 'string') return;
                console.log('iFrame Message:', m);
                const parsed: FrameMessage = JSON.parse(m.data);
                if (parsed && parsed.type === 'backoffice') {
                    parsed.status === 'success' ? resolve() : reject();
                    window.removeEventListener('message', onMessage);
                }
            };
            window.addEventListener('message', onMessage);
        } else {
            reject('Application is not in an iFrame.');
        }
    });
}
