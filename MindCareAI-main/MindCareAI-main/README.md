# MindCareAI — Emotion-Aware Mental Wellness Companion

MindCareAI is an AI-powered mental wellness web application designed to provide supportive conversations through text and voice interaction. It combines facial emotion estimation with AI-generated responses to create a more personalized user experience.

## Features

- **AI-Powered Conversations:** Generates supportive responses using an AI language model.
- **Facial Emotion Estimation:** Uses DeepFace and OpenCV to estimate facial expressions from a webcam image.
- **Text and Voice Interaction:** Supports text input, browser-based speech recognition, and text-to-speech responses.
- **Mood Tracking:** Displays emotion history through a mood chart.
- **Web-Based Interface:** Provides an interactive frontend built with React and TypeScript.

## Technology Stack

**Frontend**
- React
- TypeScript
- Vite
- Tailwind CSS

**Backend**
- Python
- FastAPI
- Uvicorn

**AI and Computer Vision**
- DeepFace
- OpenCV
- TensorFlow, if required by the installed dependencies
- OpenRouter API for conversational responses

## Project Structure

```text
MindCareAI/
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── package-lock.json
├── backend/
│   ├── app.py
│   └── requirements.txt
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js and npm
- Python 3.10 (recommended for the current backend environment)
- An OpenRouter API key

## Setup and Installation

### 1. Clone the repository

```bash
git clone https://github.com/Alex2op/MindCareAI.git
cd MindCareAI
```

### 2. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

### 3. Set up the backend

Open a separate terminal from the repository root and run:

```bash
cd backend
python -m pip install -r requirements.txt
```

Create a local `.env` file inside the backend folder and configure your `OPENROUTER_API_KEY`. Never commit this file or share your API key publicly.

Start the backend:

```bash
python -m uvicorn app:app --reload
```

The backend should be available at `http://127.0.0.1:8000`. If enabled, its API documentation is available at `http://127.0.0.1:8000/docs`.

## Usage

1. Start both the frontend and backend.
2. Open the frontend in your browser.
3. Allow camera and microphone access when prompted.
4. Enter a message or use voice input.
5. The application can estimate facial emotion from a camera frame and generate a supportive conversational response.

## Privacy and Limitations

Facial emotion estimation is an approximate interpretation of visible expressions and does not establish a person's actual emotional state. MindCareAI is intended for general wellness support, not medical diagnosis or emergency mental health care.

Keep API keys and other credentials private. Review the application's data handling before using it with sensitive personal information.

## Future Improvements

- Improve emotion tracking and visualization.
- Add configurable user preferences.
- Improve error handling and accessibility.
- Add automated tests and deployment support.

## Author

Developed as an AI and machine learning web application project.

## License

No license has been specified yet.
