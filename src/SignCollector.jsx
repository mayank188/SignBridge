import { useRef, useState } from "react";
import SignCamera from "./SignCamera";
import { normalizeKeypoints } from "./lib/math";
import { downloadJSON, loadJSONFile } from "./lib/files";

const PHRASES = ["hello","goodbye","yes","no","i like you","thank you"];

export default function SignCollector(){
  const [label, setLabel] = useState(PHRASES[0]);
  const [samples, setSamples] = useState([]);
  const [status, setStatus] = useState("");
  const [showOverlay, setShowOverlay] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const bufRef = useRef([]);

  const WINDOW = 15;

  function onFrameVec(vec){
    if (!vec || vec.length === 0) return;
    const norm = normalizeKeypoints(vec);
    bufRef.current.push(norm);
    if (bufRef.current.length > WINDOW) bufRef.current.shift();
  }

  function capture(){
    if (bufRef.current.length < WINDOW) { setStatus("Hold the sign for a moment…"); return; }
    const feat = new Array(bufRef.current[0].length).fill(0);
    for (const f of bufRef.current) for (let i=0;i<f.length;i++) feat[i]+=f[i];
    for (let i=0;i<feat.length;i++) feat[i]/=bufRef.current.length;
    setSamples(s=>[...s, { label, feat }]);
    setStatus(`Captured "${label}" (${samples.length+1})`);
  }

  function save(){ downloadJSON("sign_samples.json", samples); }
  async function load(e){ const f=e.target.files?.[0]; if(!f) return; const d=await loadJSONFile(f); setSamples(d); }

  return (
    <div>
      <h2>Dataset Collector</h2>
      <div style={{display:"flex", gap:8, flexWrap:"wrap", alignItems:"center", marginBottom:8}}>
        <select value={label} onChange={e=>setLabel(e.target.value)}>
          {PHRASES.map(p=><option key={p} value={p}>{p}</option>)}
        </select>
        <button onClick={capture}>Capture Sample</button>
        <button onClick={save}>Save JSON</button>
        <label>
          <input type="file" accept="application/json" onChange={load} style={{display:"none"}} />
          <span style={{padding:"6px 10px", border:"1px solid #888", borderRadius:8, cursor:"pointer"}}>Load JSON</span>
        </label>

        {/* Toggles */}
        <label style={{marginLeft:12}}>
          <input type="checkbox" checked={showOverlay} onChange={e=>setShowOverlay(e.target.checked)} />
          {" "}Show overlay
        </label>
        <label>
          <input type="checkbox" checked={showSkeleton} onChange={e=>setShowSkeleton(e.target.checked)} />
          {" "}Show skeleton lines
        </label>
      </div>

      <p>{status}</p>
      <p>Total samples: {samples.length}</p>

      <SignCamera onFrameVec={onFrameVec} showOverlay={showOverlay} showSkeleton={showSkeleton} />

      <p style={{opacity:.7, marginTop:8}}>Tip: good light; keep both hands visible; capture 10–20 samples per sign.</p>
    </div>
  );
}
