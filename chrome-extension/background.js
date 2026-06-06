// background.js (Definitive Architecture)

let socket = null;
let isRecording = false;
let currentMeetingTitle = null;
let socketResolver = null;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ isRecording: false, meetingTitle: null });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case "get_recording_state":
      sendResponse({ isRecording, meetingTitle: currentMeetingTitle });
      break;

    case "start_recording":
      handleStartRecording(message.payload);
      break;

    case "stop_recording":
      handleStopRecording();
      break;

    case "audio_chunk_from_offscreen":
      if (socket && socket.readyState === WebSocket.OPEN && message.payload) {
        const binaryData = new Uint8Array(Object.values(message.payload));
        socket.send(binaryData);
      }
      break;

    case "offscreen_recording_ended":
      handleStopRecording(false);
      break;

    case "mic_capture_failed":
      console.error("Background: Mic capture failed.", JSON.stringify(message.payload));
      chrome.storage.local.set({ recordingError: message.payload });
      chrome.runtime.sendMessage({ action: 'display_error_to_user', payload: message.payload });
      handleStopRecording(false, true);
      break;
  }
});

function connectToSocket(title) {
  return new Promise((resolve, reject) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      return resolve();
    }

    const timeout = setTimeout(() => {
      socket = null;
      socketResolver = null;
      reject(new Error("WebSocket connection timed out (30s)."));
    }, 30000);

    socketResolver = () => {
      clearTimeout(timeout);
      socketResolver = null;
      resolve();
    };

    try {
      socket = new WebSocket("wss://standnote.onrender.com/api/v1/ws/live-meeting");
    } catch (e) {
      clearTimeout(timeout);
      socket = null;
      socketResolver = null;
      return reject(new Error("WebSocket constructor failed: " + e.message));
    }

    socket.onopen = () => {
      console.log("[WS] Connection open.");
      socket.send(JSON.stringify({ role: "recorder", title }));
      setTimeout(() => {
        if (socketResolver) socketResolver();
      }, 300);
    };

    socket.onclose = (event) => {
      clearTimeout(timeout);
      socketResolver = null;
      console.warn(`[WS] Closed code=${event.code} clean=${event.wasClean}`);
      if (isRecording) handleStopRecording(false);
    };

    socket.onerror = (event) => {
      clearTimeout(timeout);
      socketResolver = null;
      console.error("[WS] Error:", event);
      chrome.runtime.sendMessage({
        action: 'display_error_to_user',
        payload: {
          errorName: "WebSocketError",
          userFriendlyMessage: "Could not connect to the transcription server. Please ensure the server is running."
        }
      });
      handleStopRecording(false, true);
      reject(new Error("WebSocket connection failed."));
    };
  });
}

async function handleStartRecording(payload) {
  if (isRecording) {
    console.warn("Start ignored: already recording.");
    return;
  }

  const { mode, meetingTitle } = payload;

  try {
    await connectToSocket(meetingTitle);
    await setupAndStartOffscreenCapture(mode);

    isRecording = true;
    currentMeetingTitle = meetingTitle;
    await chrome.storage.local.set({ isRecording: true, meetingTitle: meetingTitle });
    await notifyContentScript(true, meetingTitle);

  } catch (error) {
    console.error("Background: Failed to start recording.", error);
    chrome.runtime.sendMessage({
      action: 'display_error_to_user',
      payload: { userFriendlyMessage: `Failed to start recording: ${error.message}` }
    });
    socket = null;
    socketResolver = null;
    handleStopRecording(false, true);
  }
}

async function handleStopRecording(sendEndSignal = true, isError = false) {
  if (!isRecording && !isError) return;
  isRecording = false;
  currentMeetingTitle = null;

  await chrome.storage.local.set({ isRecording: false, meetingTitle: null });
  await notifyContentScript(false, null);

  if (await chrome.offscreen.hasDocument()) {
    chrome.runtime.sendMessage({ action: 'stop_capture' });
  }

  if (socket) {
    if (sendEndSignal && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ text: "__END__" }));
    }
    socket.close();
  }
  socket = null;
  socketResolver = null;
}

async function setupAndStartOffscreenCapture(mode) {
  if (!(await chrome.offscreen.hasDocument())) {
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['USER_MEDIA'],
      justification: 'To record microphone or tab audio.'
    });
  }

  // Wait for the offscreen document to signal it's ready.
  // This avoids a race where the onMessage listener isn't registered yet.
  await new Promise((resolve) => {
    const handler = (msg) => {
      if (msg.action === 'offscreen_ready') {
        chrome.runtime.onMessage.removeListener(handler);
        resolve();
      }
    };
    chrome.runtime.onMessage.addListener(handler);
    // Safety timeout in case the offscreen doc never responds
    setTimeout(() => {
      chrome.runtime.onMessage.removeListener(handler);
      resolve();
    }, 3000);
  });

  let messageForOffscreen;
  if (mode === 'tab') {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) throw new Error("No active tab found.");
    const streamId = await chrome.tabCapture.getMediaStreamId({ targetTabId: tab.id });
    messageForOffscreen = { action: 'start_capture', payload: { mode: 'tab', streamId } };
  } else {
    messageForOffscreen = { action: 'start_capture', payload: { mode: 'mic' } };
  }

  chrome.runtime.sendMessage(messageForOffscreen);
}

async function notifyContentScript(isRecording, meetingTitle) {
  try {
    const tabs = await chrome.tabs.query({
      url: ["http://localhost/*", "http://127.0.0.1/*", "*://*/*"]
    });
    for (const tab of tabs) {
      if (tab.status === 'complete') {
        chrome.tabs.sendMessage(tab.id, {
          action: 'state_change',
          payload: { isRecording, meetingTitle }
        }).catch(e => console.debug(`Could not message tab ${tab.id}.`));
      }
    }
  } catch (e) {
    console.error("Could not query tabs:", e);
  }
}
