from fastapi import FastAPI
from pydantic import BaseModel
import os
import requests
import cv2
from deepface import DeepFace
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================
# Environment
# ==========================
API_KEY = os.getenv("OPENROUTER_API_KEY")
API_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = "gpt-3.5-turbo"

HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

conversation_history = [
    {
        "role": "system",
        "content": (
            "You are a professional mental wellness assistant who responds like a licensed therapist "
            "and a deeply understanding close friend. "
            "You listen attentively, validate emotions, and respond with warmth, emotional intelligence, "
            "and calm reassurance. "
            "You ask gentle follow-up questions when helpful, encourage healthy reflection, "
            "and offer grounding techniques when the user feels overwhelmed. "
            "You never rush the user, never judge, and never sound robotic. "
            "You do not diagnose or prescribe medication. "
            "Your tone is human, steady, compassionate, and safe."
        )
    }
]



# ==========================
# Request Schema
# ==========================
class ChatRequest(BaseModel):
    message: str

# ==========================
# Emotion Detection
# ==========================
def detect_face_emotion():
    cam = cv2.VideoCapture(0)
    ret, frame = cam.read()
    cam.release()

    if not ret:
        return "Neutral"

    try:
        result = DeepFace.analyze(frame, actions=["emotion"], enforce_detection=False)
        if isinstance(result, list):
            return result[0]["dominant_emotion"].capitalize()
        return result["dominant_emotion"].capitalize()
    except:
        return "Neutral"

# ==========================
# Chat API
# ==========================
@app.post("/chat")
def chat(req: ChatRequest):
    emotion = detect_face_emotion()

    conversation_history.append({
        "role": "user",
        "content": f"({emotion}) {req.message}"
    })

    payload = {
        "model": MODEL,
        "messages": conversation_history,
        "temperature": 0.7,
        "max_tokens": 200
    }

    response = requests.post(API_URL, headers=HEADERS, json=payload)
    reply = response.json()["choices"][0]["message"]["content"]

    conversation_history.append({
        "role": "assistant",
        "content": reply
    })

    return {
        "emotion": emotion,
        "reply": reply
    }
