import { useState } from "react";
import CameraView from "./CameraView";
import STT from "./STT";
import SpeechToSign from "./SpeechToSign";
import SignCollector from "./SignCollector";
import SignLive from "./SignLive";

export default function App() {
  const [tab, setTab] = useState("speech2sign");

  return (
    <div style={{ padding: 16, fontFamily: "system-ui, sans-serif" }}>
      <h1>SignBridge – Prototype</h1>

      <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }}>
        <button onClick={()=>setTab("camera")}>📷 Camera</button>
        <button onClick={()=>setTab("speech")}>🎤 Speech → Text</button>
        <button onClick={()=>setTab("speech2sign")}>🤟 Speech → Sign</button>
        <button onClick={()=>setTab("collector")}>🧩 Collector</button>
        <button onClick={()=>setTab("live")}>✋ Sign → Text</button>
      </div>

      {tab === "camera" && <CameraView />}
      {tab === "speech" && <STT />}
      {tab === "speech2sign" && <SpeechToSign />}
      {tab === "collector" && <SignCollector />}
      {tab === "live" && <SignLive />}

      <p style={{opacity:.6, marginTop:16}}>Tip: collect 10–20 samples per sign, then load them in “Sign → Text”.</p>
    </div>
  );
}
