// popup.js - Requests mic permission from the popup (user gesture context),
// then starts recording via background.

const POLL_INTERVAL_MS = 500;

document.addEventListener("DOMContentLoaded", () => {
  const startForm = document.getElementById("startForm");
  const stopBtn = document.getElementById("stopBtn");
  const meetingTitleInput = document.getElementById("meetingTitle");
  const recordingView = document.getElementById("recording-view");
  const idleView = document.getElementById("idle-view");
  const errorArea = document.getElementById("error-message-area");
  const errorText = document.getElementById("error-text");
  const errorActions = document.getElementById("error-actions");
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

  function loadPersistedState() {
    chrome.storage.local.get(["isRecording", "meetingTitle", "recordingError"], (data) => {
      if (data.recordingError) showError(data.recordingError);
      setRecordingUI(!!data.isRecording);
    });
  }

  function showError(errorPayload) {
    const payload = errorPayload || {};
    const msg = payload.userFriendlyMessage || payload.errorMessage || 'An unknown error occurred.';
    if (errorText) errorText.textContent = msg;
    if (errorArea) errorArea.style.display = 'block';
    if (errorActions) errorActions.style.display = 'flex';

    const isPermission = payload.errorName === 'NotAllowedError' ||
                         payload.errorName === 'PermissionDeniedError' ||
                         payload.rawMessage === 'Permission dismissed';
    if (openSettingsBtn) openSettingsBtn.style.display = isPermission ? 'inline-block' : 'none';
  }

  let pollHandle = null;
  function startPolling() {
    stopPolling();
    pollHandle = setInterval(() => {
      chrome.storage.local.get(["isRecording", "recordingError"], (data) => {
        if (data.recordingError && !data.isRecording) showError(data.recordingError);
        if (data.isRecording) {
          errorArea.style.display = "none";
          setRecordingUI(true);
        }
      });
    }, POLL_INTERVAL_MS);
  }
  function stopPolling() {
    if (pollHandle) clearInterval(pollHandle);
    pollHandle = null;
  }

  // --- Main submit: request mic from popup (user gesture), then start ---
  startForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = meetingTitleInput.value.trim();
    if (!title) { alert("Please enter a meeting title."); return; }

    const audioTypeEl = document.querySelector('input[name="audioType"]:checked');
    const mode = audioTypeEl.value;

    // For mic mode, we need to trigger the permission prompt from a user gesture.
    // The popup's click handler IS a user gesture, so getUserMedia here will
    // show Chrome's permission prompt. We immediately stop the stream — we just
    // needed Chrome to register the grant and grab the deviceId.
    if (mode === 'mic') {
      try {
        const tempStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const micDeviceId = tempStream.getTracks()[0]?.getSettings()?.deviceId || null;
        tempStream.getTracks().forEach(t => t.stop());

        chrome.storage.local.set({ recordingError: null, micDeviceId }, () => {
          chrome.runtime.sendMessage({
            action: "start_recording",
            payload: { mode, meetingTitle: title, micDeviceId }
          });
          errorArea.style.display = "none";
          startPolling();
        });
      } catch (permError) {
        console.error("[Popup] Mic permission error:", permError);
        showError({
          errorName: permError.name || 'NotAllowedError',
          errorMessage: 'Microphone permission denied. Please allow mic access and try again.',
          rawMessage: permError.toString()
        });
        return;
      }
    } else {
      chrome.storage.local.set({ recordingError: null }, () => {
        chrome.runtime.sendMessage({
          action: "start_recording",
          payload: { mode, meetingTitle: title }
        });
        errorArea.style.display = "none";
        startPolling();
      });
    }
  });

  stopBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "stop_recording" });
    stopPolling();
  });

  if (retryBtn) {
    retryBtn.addEventListener("click", () => {
      chrome.storage.local.set({ recordingError: null }, () => {
        errorArea.style.display = "none";
        meetingTitleInput.focus();
      });
    });
  }
  if (openSettingsBtn) {
    openSettingsBtn.addEventListener("click", () => {
      chrome.tabs.create({ url: "chrome://settings/content/microphone" });
    });
  }

  loadPersistedState();
  startPolling();
});
