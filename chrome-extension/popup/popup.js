// popup.js (Clean, minimal mic flow)

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

  // --- Load state from background ---
  chrome.storage.local.get(["isRecording", "meetingTitle", "recordingError"], (data) => {
    if (data.recordingError) showError(data.recordingError);
    setRecordingUI(!!data.isRecording);
  });

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

  // --- Start Recording ---
  startForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = meetingTitleInput.value.trim();
    if (!title) { alert("Please enter a meeting title."); return; }

    const mode = document.querySelector('input[name="audioType"]:checked').value;

    // For mic: trigger permission from popup (valid user gesture)
    if (mode === 'mic') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const deviceId = stream.getTracks()[0]?.getSettings()?.deviceId || null;
        stream.getTracks().forEach(t => t.stop());
        kickOff(mode, title, deviceId);
      } catch (err) {
        console.error("[Popup] getUserMedia failed:", err);
        const isDismissed = err.message === 'Permission dismissed' ||
                            err.name === 'NotAllowedError' ||
                            err.name === 'PermissionDeniedError';

        if (isDismissed) {
          showError({
            errorName: 'NotAllowedError',
            errorMessage: 'Chrome blocked the mic prompt. Click "Mic Settings" below, then set StandNote to "Allow".'
          });
          // Auto-open settings tab to help the user
          chrome.tabs.create({ url: 'chrome://settings/content/microphone' });
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
});
