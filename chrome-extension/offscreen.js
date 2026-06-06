// offscreen.js (Definitive Architecture)

let mediaRecorder;
let mediaStream;

async function startCapture(payload) {
  if (mediaRecorder?.state === "recording") { return; }

  try {
    if (payload.mode === 'tab') {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          chromeMediaSource: 'tab',
          chromeMediaSourceId: payload.streamId,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });
    } else {
      const micConstraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        }
      };
      if (payload.micDeviceId) {
        micConstraints.audio.deviceId = { exact: payload.micDeviceId };
      }
      mediaStream = await navigator.mediaDevices.getUserMedia(micConstraints);
    }

    // Prefer a broadly-supported MIME type; fall back if needed
    let mimeType = 'audio/webm;codecs=opus';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'audio/webm';
    }

    mediaRecorder = new MediaRecorder(mediaStream, { mimeType });

    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) {
        event.data.arrayBuffer().then(buffer => {
          chrome.runtime.sendMessage({
            action: 'audio_chunk_from_offscreen',
            payload: Array.from(new Uint8Array(buffer))
          });
        }).catch(err => {
          console.error("[Offscreen] Failed to forward audio chunk:", err);
        });
      }
    };

    mediaRecorder.onstop = () => {
      mediaStream?.getTracks().forEach(track => track.stop());
      mediaStream = null;
      mediaRecorder = null;
      chrome.runtime.sendMessage({ action: "offscreen_recording_ended" });
    };

    mediaRecorder.onerror = (event) => {
      console.error("[Offscreen] MediaRecorder error:", event.error);
      chrome.runtime.sendMessage({
        action: 'mic_capture_failed',
        payload: {
          errorName: event.error?.name || 'MediaRecorderError',
          errorMessage: event.error?.message || 'MediaRecorder encountered an error.'
        }
      });
    };

    mediaRecorder.start(1000);
    console.log("[Offscreen] Recording started successfully.");

  } catch (rawError) {
    console.error("[Offscreen] Capture failed:", rawError);
    const errorPayload = {
      errorName: rawError.name || 'UnknownError',
      errorMessage: rawError.message || 'Unknown error occurred.',
      rawMessage: rawError.toString(),
      constraint: rawError.constraint || null
    };
    chrome.runtime.sendMessage({
      action: 'mic_capture_failed',
      payload: errorPayload
    });
  }
}

function stopCapture() {
  if (mediaRecorder?.state === "recording") {
    console.log("[Offscreen] Stopping capture...");
    mediaRecorder.stop();
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'ping') {
    sendResponse({ ready: true });
    return true;
  }
  switch (message.action) {
    case 'start_capture':
      startCapture(message.payload);
      break;
    case 'stop_capture':
      stopCapture();
      break;
  }
  return false;
});

// Signal to background that the offscreen doc is fully loaded and listening.
chrome.runtime.sendMessage({ action: 'offscreen_ready', payload: { timestamp: Date.now() } });