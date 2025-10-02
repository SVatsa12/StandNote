// offscreen.js (Golden Version - Replace entire file)

let mediaRecorder;
let mediaStream;

// --- All functions are defined first ---

async function startCapture(payload) {
    if (mediaRecorder?.state === "recording") { return; }
    try {
        if (payload.mode === 'tab') {
            mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: { mandatory: { chromeMediaSource: 'tab', chromeMediaSourceId: payload.streamId } }
            });
        } else {
            mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        }
        mediaRecorder = new MediaRecorder(mediaStream, { mimeType: 'audio/webm' });
        mediaRecorder.ondataavailable = event => {
            if (event.data.size > 0) {
                event.data.arrayBuffer().then(buffer => {
                    chrome.runtime.sendMessage({ action: 'audio_chunk_from_offscreen', payload: Array.from(new Uint8Array(buffer)) });
                });
            }
        };
        mediaRecorder.onstop = () => {
            mediaStream?.getTracks().forEach(track => track.stop());
            chrome.runtime.sendMessage({ action: "offscreen_recording_ended" });
        };
        mediaRecorder.start(1000);
    } catch (error) {
        console.error("Offscreen: Failed to start capture.", error);
        chrome.runtime.sendMessage({ action: 'mic_capture_failed', payload: { errorName: error.name, errorMessage: error.message } });
    }
}

function stopCapture() {
    if (mediaRecorder?.state === "recording") {
        mediaRecorder.stop();
    }
}

// --- The message listener is defined LAST ---

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case 'start_capture':
            startCapture(message.payload);
            break;
        case 'stop_capture':
            stopCapture();
            break;
    }
    // This explicitly tells Chrome the listener is synchronous and is NOT sending a reply.
    // This is the correct pattern for "fire-and-forget" messages.
    return false;
});