# 🤝 SignBridge

SignBridge is an **AI-powered communication bridge** that converts **sign language gestures into text and speech output** in real time.  
It aims to help break communication barriers between the **deaf/mute community** and the **hearing world** using modern machine learning and computer vision technologies.

---

## 🚀 Features
- 🖐️ Real-time **hand gesture recognition** using MediaPipe and TensorFlow  
- 🧠 AI model trained on sign language datasets  
- 🔊 Converts recognized gestures into **text and speech output**  
- 🌐 Interactive **3D avatar display** to visualize gestures  
- 🎤 Supports **speech-to-text** for bidirectional communication  
- 💻 Clean UI with a simple and intuitive interface  

---

## 🧠 Tech Stack

| Technology | Purpose |
|-------------|----------|
| **Python** | Core AI logic and backend |
| **TensorFlow / Keras** | Machine Learning model for gesture recognition |
| **MediaPipe** | Hand tracking and landmark detection |
| **Flask** | Backend API to connect AI with the frontend |
| **React.js / Three.js** | Frontend interface and 3D avatar visualization |
| **JavaScript / HTML / CSS** | UI design and interactivity |
| **Text-to-Speech (TTS) API** | Converts recognized text into audio speech |

---

## 🏗️ System Architecture

1. **User Input** — Live video feed captures hand gestures.  
2. **Preprocessing** — MediaPipe detects hand landmarks and sends data to the model.  
3. **Model Prediction** — TensorFlow model predicts the corresponding sign.  
4. **Output** — Flask sends the predicted text to the frontend.  
5. **Speech Generation** — Text is converted into spoken words using a TTS engine.  
6. **3D Avatar Display** — A 3D avatar mirrors the recognized gestures visually.

---

## ⚙️ Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/yourusername/SignBridge.git
cd SignBridge
