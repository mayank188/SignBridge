import { useRef, useState } from "react";
import SignCamera from "./SignCamera";
import { normalizeKeypoints } from "./lib/math";
import { loadJSONFile } from "./lib/files";
import { KNN } from "./lib/knn";

export default function SignLive() {
  const [pred, setPred] = useState({ label: "—", conf: 0 });
  const [showOverlay, setShowOverlay] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const knnRef = useRef(new KNN(5));
  const bufRef = useRef([]);
  const WINDOW = 15;

  function onFrameVec(vec) {
    if (!vec || vec.length === 0 || knnRef.current.data?.length === 0) return;
    const norm = normalizeKeypoints(vec);
    bufRef.current.push(norm);
    if (bufRef.current.length > WINDOW) bufRef.current.shift();

    if (bufRef.current.length === WINDOW) {
      const feat = new Array(bufRef.current[0].length).fill(0);
      for (const f of bufRef.current)
        for (let i = 0; i < f.length; i++) feat[i] += f[i];
      for (let i = 0; i < feat.length; i++) feat[i] /= WINDOW;
      const out = knnRef.current.predict(feat);
      setPred({ label: out.label || "—", conf: Math.round((out.conf || 0) * 100) });
    }
  }

  async function load(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const data = await loadJSONFile(f);
    knnRef.current.clear();
    knnRef.current.bulk(data);
  }

  return (
    <div>
      <h2>Sign → Text</h2>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <label style={{ cursor: "pointer" }}>
          <input type="file" accept="application/json" onChange={load} style={{ display: "none" }} />
          <span style={{ padding: "6px 10px", border: "1px solid #888", borderRadius: 8 }}>
            Load samples
          </span>
        </label>

        {/* 🎯 Highlighted Prediction */}
        <div style={{ fontSize: "1.5rem", marginTop: "10px" }}>
          <b>Prediction:</b>{" "}
          <span
            style={{
              fontWeight: "900",
              color:
                pred.conf > 80
                  ? "#0aad3d" // green if confident
                  : pred.conf > 50
                  ? "#ff9f0a" // orange if medium
                  : "#ff3b30", // red if low
              background:
                pred.conf > 80
                  ? "#e8fbe8"
                  : pred.conf > 50
                  ? "#fff4e0"
                  : "#ffe8e8",
              padding: "6px 12px",
              borderRadius: "8px",
              marginLeft: "6px",
            }}
          >
            {pred.label.toUpperCase()}
          </span>{" "}
          <span style={{ opacity: 0.6, fontSize: "1rem" }}>({pred.conf}%)</span>
        </div>

        {/* Toggles */}
        <label style={{ marginLeft: 12 }}>
          <input
            type="checkbox"
            checked={showOverlay}
            onChange={(e) => setShowOverlay(e.target.checked)}
          />{" "}
          Show overlay
        </label>
        <label>
          <input
            type="checkbox"
            checked={showSkeleton}
            onChange={(e) => setShowSkeleton(e.target.checked)}
          />{" "}
          Show skeleton lines
        </label>
      </div>

      <SignCamera
        onFrameVec={onFrameVec}
        showOverlay={showOverlay}
        showSkeleton={showSkeleton}
      />
    </div>
  );
}
