import { useState } from "react";
import STT from "./STT";

// phrase → video file
const PHRASE_TO_VIDEO = {
  "hello": "hello.mp4",
  "goodbye": "goodbye.mp4",
  "yes": "yes.mp4",
  "no": "no.mp4",
  "i like you": "i-like-you.mp4",
  "thank you": "thank-you.mp4",
};

export default function SpeechToSign() {
  const [heard, setHeard] = useState("");
  const [match, setMatch] = useState("");

  function onText(t) {
    const lower = t.toLowerCase();
    setHeard(lower);
    const phrases = Object.keys(PHRASE_TO_VIDEO);
    const found = phrases.find(p => lower.includes(p));
    setMatch(found || "");
  }

  const videoFile = match ? `/signs/${PHRASE_TO_VIDEO[match]}` : "";

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Speech → Sign (Video)</h2>
      <STT onText={onText} />
      <p><b>Heard:</b> {heard || "—"}</p>
      <p><b>Matched:</b> {match || "—"}</p>
      {videoFile ? (
        <video
          key={videoFile}
          src={videoFile}
          autoPlay
          loop
          muted
          playsInline
          style={{ width: "100%", maxWidth: 420, borderRadius: 12, background: "#000" }}
        />
      ) : (
        <p style={{opacity:.7}}>Say: hello, goodbye, yes, no, i like you, thank you</p>
      )}
    </div>
  );
}
