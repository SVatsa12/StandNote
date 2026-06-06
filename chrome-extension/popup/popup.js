// popup.js — Mic permission flow with accurate state detection

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

  function showError(payload) {
    const p = payload || {};
    if (errorText) errorText.textContent = p.errorMessage || p.userFriendlyMessage || 'Error';
    if (errorArea) errorArea.style.display = 'block';
    const isPerm = p.errorName === 'NotAllowedError' ||
                   p.errorName === 'PermissionDeniedError' ||
                   p.rawMessage === 'Permission dismissed';
    if (openSettingsBtn) openSettingsBtn.style.display = isPerm ? 'inline-block' : 'none';
  }

  // --- Check actual permission state via Permissions API ---
  async function getMicPermissionState() {
    try {
      const result = await navigator.permissions.query({ name: 'microphone' });
      return result.state; // 'granted', 'denied', or 'prompt'
    } catch {
      // Permissions API not supported or not queryable in this context
      return 'unknown';
    }
  }

  // --- Start Recording ---
  startForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = meetingTitleInput.value.trim();
    if (!title) { alert("Please enter a meeting title."); return; }

    const mode = document.querySelector('input[name="audioType"]:checked').value;

    if (mode === 'mic') {
      const permState = await getMicPermissionState();

      if (permState === 'denied') {
        // Permission is ACTUALLY denied in Chrome — nothing we can do except guide the user
        showError({
          errorName: 'NotAllowedError',
          errorMessage: 'Chrome has blocked microphone access for this extension. Click "Mic Settings" below to allow it.'
        });
        chrome.tabs.create({ url: 'chrome://settings/content/microphone' });
        return;
      }

      // Permission is granted or prompt — try getUserMedia
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const deviceId = stream.getTracks()[0]?.getSettings()?.deviceId || null;
        stream.getTracks().forEach(t => t.stop());
        kickOff(mode, title, deviceId);
      } catch (err) {
        console.error("[Popup] getUserMedia failed:", err);
        const isDenied = err.name === 'NotAllowedError' ||
                         err.name === 'PermissionDeniedError' ||
                         err.message === 'Permission dismissed';

        if (isDenied) {
          showError({
            errorName: 'NotAllowedError',
            errorMessage: 'Chrome blocked microphone access. Make sure no other app is using the mic, then try again.'
          });
        } else {
          showError({
            errorName: err.name,
            errorMessage: err.message || 'Could not access microphone.'
          });
        }
      }
    } else {
      kickOff(mode, title, null);
    }
  });

  function kickOff(mode, title, micDeviceId) {
    chrome.storage.local.set({ recordingError: null, micDeviceId }, () => {
      chrome.runtime.sendMessage({
        action: "start_recording",
        payload: { mode, meetingTitle: title, micDeviceId }
      });
    });
  }

  // --- Stop Recording ---
  stopBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "stop_recording" });
  });

  // --- Retry / Settings buttons ---
  if (retryBtn) {
    retryBtn.addEventListener("click", () => {
      chrome.storage.local.set({ recordingError: null }, () => {
        errorArea.style.display = "none";
      });
    });
  }
  if (openSettingsBtn) {
    openSettingsBtn.addEventListener("click", () => {
      chrome.tabs.create({ url: "chrome://settings/content/microphone" });
    });
  }

  // --- Load persisted state ---
  chrome.storage.local.get(["isRecording", "meetingTitle", "recordingError"], (data) => {
    if (data.recordingError) showError(data.recordingError);
    setRecordingUI(!!data.isRecording);
  });
});
