import { useEffect, useRef, useState } from "react";
import { getHolistic } from "./lib/mediapipe";

export default function SignCamera({
  onFrameVec,
  showOverlay = true,
  showSkeleton = false
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [status, setStatus] = useState("Starting camera…");
  const [err, setErr] = useState("");

  // Hand landmark connection indices (from MediaPipe Hands)
  const HAND_CONNECTIONS = [
    [0,1],[1,2],[2,3],[3,4],      // thumb
    [0,5],[5,6],[6,7],[7,8],      // index
    [5,9],[9,10],[10,11],[11,12], // middle
    [9,13],[13,14],[14,15],[15,16], // ring
    [13,17],[17,18],[18,19],[19,20], // pinky
    [0,17] // palm base
  ];

  // Pose connections for shoulders → wrists (indices 11..16)
  const POSE_ARM_CONNECTIONS = [[11,12],[11,13],[13,15],[12,14],[14,16]];

  useEffect(() => {
    let stream;
    let raf = 0;
    let running = true;
    let landmarker = null;

    async function start() {
      try {
        // Start camera
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 640, height: 480 },
          audio: false,
        });
        const v = videoRef.current;
        v.srcObject = stream;
        await v.play();
        setStatus("Loading landmark model…");

        // Load model
        landmarker = await getHolistic();
        setStatus("Running…");

        const loop = async () => {
          if (!running) return;
          const v = videoRef.current;
          const c = canvasRef.current;
          if (!v || !c) {
            raf = requestAnimationFrame(loop);
            return;
          }
          const ctx = c.getContext("2d");
          c.width = v.videoWidth || 640;
          c.height = v.videoHeight || 480;

          // Draw mirrored video
          ctx.save();
          ctx.scale(-1, 1);
          ctx.drawImage(v, -c.width, 0, c.width, c.height);
          ctx.restore();

          // Detect
          let res;
          try {
            res = await landmarker.detectForVideo(v, performance.now());
          } catch (e) {
            console.warn("Landmark error:", e);
          }

          // Build features
          const vec = [];
          const add = (arr) => { if (!arr) return; for (const p of arr) vec.push(p.x, p.y); };

          const pose = res?.poseLandmarks?.[0];
          const left = res?.leftHandLandmarks?.[0];
          const right = res?.rightHandLandmarks?.[0];

          add(pose ? pose.slice(11, 17) : null); // shoulders→wrists
          add(left);
          add(right);

          if (onFrameVec && vec.length) onFrameVec(vec);

          if (showOverlay) {
            // Dots
            const drawDots = (landmarks, color, radius = 3) => {
              if (!landmarks) return;
              ctx.fillStyle = color;
              for (const p of landmarks) {
                const x = c.width - p.x * c.width; // mirror x
                const y = p.y * c.height;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
              }
            };

            // Lines
            const drawLines = (landmarks, connections, color, width = 2) => {
              if (!landmarks) return;
              ctx.strokeStyle = color;
              ctx.lineWidth = width;
              ctx.beginPath();
              for (const [a, b] of connections) {
                const pa = landmarks[a], pb = landmarks[b];
                if (!pa || !pb) continue;
                const ax = c.width - pa.x * c.width;
                const ay = pa.y * c.height;
                const bx = c.width - pb.x * c.width;
                const by = pb.y * c.height;
                ctx.moveTo(ax, ay);
                ctx.lineTo(bx, by);
              }
              ctx.stroke();
            };

            // Pose (arms) — blue
            drawDots(pose ? pose.slice(11,17) : null, "#3ea6ff", 3);
            if (showSkeleton) drawLines(pose, POSE_ARM_CONNECTIONS, "#3ea6ff", 2);

            // Left hand — green
            drawDots(left, "#34c759", 3);
            if (showSkeleton) drawLines(left, HAND_CONNECTIONS, "#34c759", 2);

            // Right hand — magenta
            drawDots(right, "#ff2d55", 3);
            if (showSkeleton) drawLines(right, HAND_CONNECTIONS, "#ff2d55", 2);
          }

          raf = requestAnimationFrame(loop);
        };
        loop();
      } catch (e) {
        console.error(e);
        setErr(e.message || String(e));
        setStatus("Failed to start");
      }
    }

    start();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [onFrameVec, showOverlay, showSkeleton]);

  return (
    <div>
      <div style={{ marginBottom: 6, fontSize: 12, opacity: 0.8 }}>
        {err ? <span style={{ color: "salmon" }}>Error: {err}</span> : status}
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", maxWidth: 420, borderRadius: 12, background: "#000" }}
      />
      <video ref={videoRef} playsInline muted style={{ display: "none" }} />
    </div>
  );
}
