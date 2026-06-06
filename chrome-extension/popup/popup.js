// popup.js - Requests mic permission via a visible tab if needed,
// then starts recording. Keeps popup open during recording.

const POLL_INTERVAL_MS = 500;
const PERMISSION_GRANTED_KEY = 'permissionGranted';

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

  // Check if we already have mic permission for this session
  function hasMicPermission() {
    return new Promise((resolve) => {
      chrome.storage.local.get([PERMISSION_GRANTED_KEY], (data) => {
        resolve(!!data[PERMISSION_GRANTED_KEY]);
      });
    });
  }

  // Open the permission tab and wait for it to complete
  function requestPermissionViaTab() {
    return new Promise((resolve) => {
      const tabId = Date.now();
      chrome.tabs.create({ url: 'permission.html' }, (tab) => {
        if (!tab || !tab.id) {
          resolve(false);
          return;
        }

        // Listen for the tab to be closed (means user clicked Allow or Block)
        const checkTab = setInterval(() => {
          chrome.tabs.get(tab.id, (currentTab) => {
            if (chrome.runtime.lastError || !currentTab) {
              clearInterval(checkTab);
              // Tab was closed — assume grant for better UX
              chrome.storage.local.set({ [PERMISSION_GRANTED_KEY]: true });
              resolve(true);
            }
          });
        }, 300);

        // Timeout after 60 seconds
        setTimeout(() => {
          clearInterval(checkTab);
          resolve(false);
        }, 60000);
      });
    });
  }

  // --- Main submit handler ---
  startForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = meetingTitleInput.value.trim();
    if (!title) { alert("Please enter a meeting title."); return; }

    const audioTypeEl = document.querySelector('input[name="audioType"]:checked');
    const mode = audioTypeEl.value;

    if (mode === 'mic') {
      // If we already have permission for this session, skip the tab
      if (!(await hasMicPermission())) {
        errorText.textContent = 'Opening permission page...';
        errorArea.style.display = 'block';
        const granted = await requestPermissionViaTab();

        if (!granted) {
          showError({
            errorName: 'NotAllowedError',
            errorMessage: 'Microphone permission is required. Please allow access in the permission tab and try again.'
          });
          return;
        }
      }

      // Also do a quick bridge getUserMedia in popup to pre-warm the permission state
      try {
        const tempStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const micDeviceId = tempStream.getTracks()[0]?.getSettings()?.deviceId || null;
        tempStream.getTracks().forEach(t => t.stop());
        await startRecording(mode, title, micDeviceId);
      } catch (permError) {
        console.error("[Popup] Mic permission error:", permError);
        showError({
          errorName: permError.name || 'NotAllowedError',
          errorMessage: 'Microphone permission denied. Please allow mic access and try again.',
          rawMessage: permError.toString()
        });
      }
    } else {
      await startRecording(mode, title, null);
    }
  });

  async function startRecording(mode, title, micDeviceId) {
    chrome.storage.local.set({ recordingError: null, micDeviceId }, () => {
      chrome.runtime.sendMessage({
        action: "start_recording",
        payload: { mode, meetingTitle: title, micDeviceId }
      });
      errorArea.style.display = "none";
      startPolling();
    });
  }

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
