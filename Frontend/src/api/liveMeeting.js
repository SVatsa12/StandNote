const BASE_URL = "http://127.0.0.1:8000/api/v1/live-meeting";


// Fetch all live meetings for a specific user
export const fetchUserLiveMeetings = async (userId) => {
  const res = await fetch(`${BASE_URL}/user/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch live meetings");
  return res.json();
};

// Save a live meeting (transcript + summary + timestamp)
export const saveLiveMeeting = async (meetingData) => {
  const res = await fetch(`${BASE_URL}/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(meetingData),
  });

  if (!res.ok) {
    throw new Error("Failed to save meeting");
  }

  return res.json();
};
export const deleteLiveMeetingById = async (meetingId) => {
  const res = await fetch(`${BASE_URL}/${meetingId}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete meeting");
  return res.json();
};
export const fetchLiveMeetingById = async (meetingId) => {
  const res = await fetch(`${BASE_URL}/${meetingId}`);
  if (!res.ok) throw new Error("Failed to fetch meeting by ID");
  return res.json();
};
export const fetchAllLiveMeetings = async () => {
  const res = await fetch(`${BASE_URL}/all`);
  if (!res.ok) throw new Error("Failed to fetch all live meetings");
  return res.json();
};