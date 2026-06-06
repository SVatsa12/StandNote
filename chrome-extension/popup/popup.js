// popup.js (Minimal — just collect form data and tell background to start/stop)

document.addEventListener("DOMContentLoaded", () => {
  const startForm = document.getElementById("startForm");
  const stopBtn = document.getElementById("stopBtn");
  const meetingTitleInput = document.getElementById("meetingTitle");
  const recordingView = document.getElementById("recording-view");
  const idleView = document.getElementById("idle-view");
  const errorArea = document.getElementById("error-message-area");
  const errorText = document.getElementById("error-text");
  const retryBtn = document.getElementById("retryBtn");
  const openSettingsBtn = document.getElementById("openSettingsBtn");

  function setRecordingUI(isRecording) {
    if (isRecording) {
      idleView.style.display = "none";
      recordingView.style.display = "block";
      errorArea.style.display = "none";
    } else {
      recordingView.style.display = "none";
      idleView.style.display = "block";
    }
  }

  // --- Load state from background service worker ---
  chrome.runtime.sendMessage({ action: "get_recording_state" }, (response) => {
    if (response && response.isRecording) {
      setRecordingUI(true);
    }
  });

  // Listen for error broadcasts from background
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'display_error_to_user') {
      const p = message.payload || {};
      if (errorText) errorText.textContent = p.errorMessage || p.userFriendlyMessage || 'Error';
      if (errorArea) errorArea.style.display = 'block';
      setRecordingUI(false);

      const isPerm = p.errorName === 'NotAllowedError' ||
                     p.errorName === 'PermissionDeniedError' ||
                     p.rawMessage === 'Permission dismissed';
      if (openSettingsBtn) openSettingsBtn.style.display = isPerm ? 'inline-block' : 'none';
    }
  });

  // --- Start Recording (request permission if mic mode) ---
  startForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = meetingTitleInput.value.trim();
    if (!title) { alert("Please enter a meeting title."); return; }

    const mode = document.querySelector('input[name="audioType"]:checked').value;

    if (mode === 'mic') {
      try {
        // We must request mic permission in a visible page (popup)
        // so the offscreen document can capture it successfully.
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        console.error("Microphone permission denied:", err);
        if (errorText) errorText.textContent = "Microphone permission is required for mic recording.";
        if (errorArea) errorArea.style.display = 'block';
        if (openSettingsBtn) openSettingsBtn.style.display = 'inline-block';
        return;
      }
    }

    chrome.runtime.sendMessage({
      action: "start_recording",
      payload: { mode, meetingTitle: title }
    });
    // Don't close popup — keep it open so user can see status and stop button
    setRecordingUI(true);
    errorArea.style.display = "none";
  });

  // --- Stop Recording ---
  stopBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "stop_recording" });
    setRecordingUI(false);
  });

  // --- Retry ---
  if (retryBtn) {
    retryBtn.addEventListener("click", () => {
      chrome.storage.local.set({ recordingError: null }, () => {
        errorArea.style.display = "none";
      });
    });
  }

  // --- Open Mic Settings ---
  if (openSettingsBtn) {
    openSettingsBtn.addEventListener("click", () => {
      chrome.tabs.create({ url: "chrome://settings/content/microphone" });
    });
  }
});
