// Replace the entire content of content-script.js

console.log("[Log 5 - Content Script] Script loaded and listening for messages."); // LOG 5

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'state_change') {
    console.log("[Log 6 - Content Script] Received 'state_change' message from background. Dispatching event to page.", message.payload); // LOG 6
    
    window.dispatchEvent(new CustomEvent('standnoteStateChange', {
      detail: {
        isRecording: message.payload.isRecording,
        meetingTitle: message.payload.meetingTitle
      }
    }));
  }
  return true;
});