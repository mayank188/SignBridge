import { FilesetResolver, HolisticLandmarker } from "@mediapipe/tasks-vision";

let landmarker = null;

export async function getHolistic() {
  if (landmarker) return landmarker;

  const fileset = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  landmarker = await HolisticLandmarker.createFromOptions(fileset, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/holistic_landmarker/holistic_landmarker/float16/latest/holistic_landmarker.task",
    },
    runningMode: "VIDEO",
    numFaces: 1,
  });

  return landmarker;
}
