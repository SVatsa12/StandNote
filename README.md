# StandNote.AI

StandNote.AI is a browser extension that generates **real-time transcripts** and **summaries** for your live meetings. Designed for productivity, it ensures you never miss important points during discussions, and it integrates with an authentication system for secure access.

---

## 🚀 Features

* **Live Transcription**: Captures spoken content in meetings and converts it into text in real time.
* **Smart Summarization**: Automatically generates concise summaries highlighting key discussion points.
* **Authentication System**: Secure login flow to protect user data and meeting content.
* **Cross-Platform Support**: Works seamlessly with popular meeting platforms.
* **Storage & Retrieval**: Save transcripts for later reference.

---

## 📦 Project Structure

* **Backend/** → Python backend for transcription, summarization, and authentication.
* **Frontend/** → React-based user interface for the extension.
* **chrome-extension/** → Browser extension code for integrating with meetings.

---

## ⚙️ Installation & Setup

### Prerequisites

* Node.js & npm installed
* Python 3.x
* Git

### Clone the Repository

```bash
git clone https://github.com/SVatsa12/StandNote.git
cd StandNote
```

### Install Dependencies

```bash
# Frontend
cd Frontend
npm install

# Backend
cd Backend
pip install -r requirements.txt
```

### Run the Project


# Start backend
cd Backend
python -m venv venv                  (only use  for the first time  while creating the virtual environment)
.\venv\Scripts\Activate.ps1          (To activate the virtual environment)
uvicorn app.main:app --reload        (command to start the backend)

# Start frontend
cd Frontend
npm start

# Load Chrome Extension
1. Open Chrome → More Tools → Extensions
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `chrome-extension/` folder


---

## 🔒 Authentication

* Users must sign up/sign in to access the extension.
* JWT-based authentication is implemented for secure session handling.

---

## 🧠 Tech Stack

* **Frontend**: React (JavaScript)
* **Backend**: Python (Flask / FastAPI)
* **AI/NLP**: Speech-to-Text (STT), Summarization models
* **Database**: SQLite / PostgreSQL
* **Extension**: Chrome APIs

---

## 📌 Roadmap

* [x] Build Chrome Extension MVP
* [x] Implement real-time transcription
* [x] Add authentication system (JWT)
* [ ] Integrate summarization models with improved accuracy
* [ ] Export transcripts to PDF/Docs
* [ ] Speaker diarization (identify who said what)


---

## 🤝 Contributing

Contributions are welcome! Please fork this repo and submit a pull request.

## 📜 License

This project is licensed under the MIT License.


## 👨‍💻 Author

Built by **Shubham Vatsa**
