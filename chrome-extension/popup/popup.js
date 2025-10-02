// popup.js (Complete and Final Version)

document.addEventListener("DOMContentLoaded", () => {
    // --- Elements ---
    const startForm = document.getElementById("startForm");
    const stopBtn = document.getElementById("stopBtn");
    const meetingTitleInput = document.getElementById("meetingTitle");
    const recordingView = document.getElementById("recording-view");
    const idleView = document.getElementById("idle-view");
    const errorArea = document.getElementById("error-message-area");
    const errorText = document.getElementById("error-text");
    const retryBtn = document.getElementById("retryBtn");
    const openSettingsBtn = document.getElementById("openSettingsBtn");

    // --- UI State Function ---
    function setRecordingUI(isRecording) {
        if (isRecording) {
            idleView.style.display = "none";
            recordingView.style.display = "block";
        } else {
            recordingView.style.display = "none";
            idleView.style.display = "block";
        }
    }

    // --- State Synchronization on Popup Open ---
    chrome.runtime.sendMessage({ action: "get_recording_state" }, (response) => {
        if (chrome.runtime.lastError) {
            console.warn("Could not get recording state:", chrome.runtime.lastError.message);
            setRecordingUI(false);
        } else if (response && response.isRecording) {
            setRecordingUI(true);
        } else {
            setRecordingUI(false);
        }
    });

    // --- Event Listeners ---
    startForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = meetingTitleInput.value.trim();
        if (!title) {
            alert("Please enter a meeting title.");
            return;
        }
        const audioTypeEl = document.querySelector('input[name="audioType"]:checked');
        const mode = audioTypeEl.value;
        chrome.runtime.sendMessage({ action: "start_recording", payload: { mode, meetingTitle: title } });
        window.close();
    });

    stopBtn.addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "stop_recording" });
        window.close();
    });

    if (retryBtn) {
        retryBtn.addEventListener("click", () => {
            errorArea.style.display = "none";
            startForm.dispatchEvent(new Event('submit', { cancelable: true }));
        });
    }
    if (openSettingsBtn) {
        openSettingsBtn.addEventListener("click", () => {
            chrome.tabs.create({ url: "chrome://settings/content/microphone" });
        });
    }
});

// --- Message listener for UI-specific updates (like errors) ---
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'display_error_to_user') {
        const msg = message.payload?.userFriendlyMessage || 'An unknown error occurred.';
        const errorArea = document.getElementById("error-message-area");
        const errorText = document.getElementById("error-text");
        
        if (errorArea && errorText) {
            errorText.textContent = msg;
            errorArea.style.display = 'block';
        } else {
            alert(msg);
        }
        
        // Ensure UI is in the "stopped" state after an error.
        const idleView = document.getElementById("idle-view");
        const recordingView = document.getElementById("recording-view");
        if(idleView && recordingView) {
            recordingView.style.display = "none";
            idleView.style.display = "block";
        }
    }
});