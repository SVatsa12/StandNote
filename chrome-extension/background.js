// background.js (Corrected and Restructured)

let socket = null;
let isRecording = false;
let currentMeetingTitle = null;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ isRecording: false, meetingTitle: null });
});

// --- MESSAGE LISTENER ---
// This listener handles all incoming messages and calls the appropriate functions.
// MESSAGE LISTENER - Made more robust
// background.js (Corrected and Final onMessage Listener)

// background.js (Definitive Architecture - Replace entire listener)

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // This listener handles all messages. The key is to only return true
    // for messages that are truly async AND have a listener waiting for a response.

    switch (message.action) {
        // This message comes from the popup when it opens. It is a simple sync request.
        case "get_recording_state":
            sendResponse({ 
                isRecording: isRecording, 
                meetingTitle: currentMeetingTitle 
            });
            break;

        // These messages are commands from the UI. We kick off the async process
        // but DO NOT promise a reply, because the popup might close.
        case "start_recording":
            handleStartRecording(message.payload); // Kick off the async process
            break; // Do not return true
        
        case "stop_recording":
            handleStopRecording(); // Kick off the async process
            break; // Do not return true

        // --- Internal "Fire-and-Forget" Messages ---
        case "audio_chunk_from_offscreen":
            if (socket && socket.readyState === WebSocket.OPEN && message.payload) {
                const audioValues = Object.values(message.payload);
                const binaryData = new Uint8Array(audioValues);
                socket.send(binaryData);
            }
            break;

        case "offscreen_recording_ended":
            sendEndSignal();
            handleStopRecording(false);
            break;

        case "mic_capture_failed":
            console.error("Background: Microphone capture failed.", message.payload);
            chrome.runtime.sendMessage({ action: 'display_error_to_user', payload: message.payload });
            handleStopRecording(false, true);
            break;
    }

    // By not returning true for the start/stop commands, we no longer create
    // the race condition. The listener completes its job synchronously from
    // the perspective of the message channel.
});


// START RECORDING HANDLER - CORRECTED LOGIC
async function handleStartRecording(payload) {
  if (isRecording) {
    console.warn("Start command ignored: a recording is already in progress.");
    return;
  }
  
  const { mode, meetingTitle } = payload;

  try {
    // --- THIS IS THE CRUCIAL FIX ---
    // STEP 1: Get the necessary capture details (like streamId for tab mode)
    // and send the command to the offscreen document.
    await setupAndStartOffscreenCapture(mode);

    // STEP 2: Now that capture has been initiated, handle state and networking.
    isRecording = true;
    currentMeetingTitle = meetingTitle;
    await chrome.storage.local.set({ isRecording: true, meetingTitle: meetingTitle });
    await notifyContentScript(true, meetingTitle);
    connectToSocket(meetingTitle);

  } catch (error) {
    console.error("Background: Failed to start recording.", error);
    // Inform the UI of the failure
    chrome.runtime.sendMessage({
      action: 'display_error_to_user',
      payload: {
        userFriendlyMessage: `Failed to start capture: ${error.message}`
      }
    });
    // Clean up if starting failed
    handleStopRecording(false, true);
  }
}
async function handleStopRecording(sendEndSignalToWs = true, isError = false) {
  if (!isRecording && !isError) return;
  isRecording = false;
  currentMeetingTitle = null;

  await chrome.storage.local.set({ isRecording: false, meetingTitle: null });
  await notifyContentScript(false, null);

  if (await chrome.offscreen.hasDocument()) {
    // Send message to offscreen doc to stop its capture
    chrome.runtime.sendMessage({ action: 'stop_capture' });
    // Note: The offscreen document will close itself after some inactivity.
  }

  if (socket) {
    if (sendEndSignalToWs && socket.readyState === WebSocket.OPEN) {
      sendEndSignal();
    }
    socket.close();
    socket = null;
  }
}

// This new function replaces your old `setupOffscreenDocument`
async function setupAndStartOffscreenCapture(mode) {
  // Ensure the offscreen document is running.
  if (!(await chrome.offscreen.hasDocument())) {
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['USER_MEDIA'],
      justification: 'To record microphone or tab audio.'
    });
  }

  let messageForOffscreen;
  if (mode === 'tab') {
    // Get the active tab, which is required for tabCapture
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) throw new Error("No active tab found to capture.");

    // Get the streamId for the tab
    const streamId = await chrome.tabCapture.getMediaStreamId({ targetTabId: tab.id });
    
    // Create the message with the essential streamId
    messageForOffscreen = { 
      action: 'start_capture', 
      payload: { mode: 'tab', streamId: streamId } 
    };
  } else { // mode === 'mic'
    messageForOffscreen = { 
      action: 'start_capture', 
      payload: { mode: 'mic' } 
    };
  }
  
  // Send the complete message to the offscreen document
  chrome.runtime.sendMessage(messageForOffscreen);
}

function connectToSocket(title, onOpenCallback) {
  socket = new WebSocket("ws://127.0.0.1:8000/api/v1/ws/live-meeting");

  socket.onopen = () => {
    console.log("WebSocket connection established.");
    socket.send(JSON.stringify({ role: "recorder", title: title }));
    if (onOpenCallback) {
      onOpenCallback(); // Now start the offscreen recording
    }
  };

  socket.onclose = (event) => {
    console.warn(`WebSocket closed (code=${event.code}, clean=${event.wasClean})`);
    if (isRecording) {
      handleStopRecording(false);
    }
  };

  socket.onerror = (event) => {
    console.error("WebSocket Error:", event);
    chrome.runtime.sendMessage({
      action: 'display_error_to_user',
      payload: {
        errorName: "WebSocketError",
        userFriendlyMessage: "Could not connect to the transcription server. Please ensure the server is running."
      }
    });
    handleStopRecording(false, true);
  };
}

function sendEndSignal() {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ text: "__END__" }));
  }
}

async function notifyContentScript(isRecording, meetingTitle) {
  try {
    const tabs = await chrome.tabs.query({
      url: ["http://localhost/*", "http://127.0.0.1/*"]
    });
    for (const tab of tabs) {
      if (tab.status === 'complete') {
        chrome.tabs.sendMessage(tab.id, { action: 'state_change', payload: { isRecording, meetingTitle } })
          .catch(e => console.debug(`Could not send message to tab ${tab.id}.`));
      }
    }
  } catch (e) {
    console.error("Could not query tabs:", e);
  }
}