import { useEffect, useRef, useState } from "react";

export default function STT({ onText }) {
  const [listening, setListening] = useState(false);
  const [status, setStatus] = useState("Idle");
  const [heard, setHeard] = useState("");
  const recRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setStatus("SpeechRecognition not supported. Use Chrome or Edge.");
      return;
    }
    const rec = new SR();
    rec.lang = "en-IN";
    rec.interimResults = true;
    rec.continuous = true;

    rec.onstart = () => setStatus("Listening…");
    rec.onend = () => {
      if (listening) {
        try { rec.start(); } catch {}
      } else {
        setStatus("Stopped");
      }
    };
    rec.onerror = (e) => {
      setStatus(`Error: ${e.error}`);
    };
    rec.onresult = (e) => {
      let txt = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        txt += e.results[i][0].transcript;
      }
      setHeard(txt.trim());
      if (onText) onText(txt.trim());
    };

    recRef.current = rec;
  }, [listening, onText]);

  async function toggleListening() {
    const rec = recRef.current;
    if (!rec) return;

    if (listening) {
      rec.stop();
      setListening(false);
      setStatus("Stopped");
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        rec.start();
        setListening(true);
      } catch {
        setStatus("Mic permission denied.");
      }
    }
  }

  return (
    <div>
      <button onClick={toggleListening} style={{ padding: 10, marginTop: 10 }}>
        {listening ? "🛑 Stop Listening" : "🎤 Start Listening"}
      </button>
      <p style={{ opacity: 0.8, marginTop: 8 }}>{status}</p>
      <div
        style={{
          background: "#f5f5f5",
          padding: 12,
          borderRadius: 10,
          minHeight: 60,
          marginTop: 10,
          color: "#111",
        }}
      >
        {heard || "Say something..."}
      </div>
    </div>
  );
}
