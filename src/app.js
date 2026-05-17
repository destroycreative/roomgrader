import { scoreRoomFromPixels, scoreSummary } from "./roomScore.js";

const photoInput = document.getElementById("photoInput");
const previewCanvas = document.getElementById("previewCanvas");
const scoreButton = document.getElementById("scoreButton");
const result = document.getElementById("result");
const scoreValue = document.getElementById("scoreValue");
const scoreSummaryEl = document.getElementById("scoreSummary");
const previewContext = previewCanvas.getContext("2d", { willReadFrequently: true });

const MAX_IMAGE_DIMENSION = 300;
let selectedImageBitmap = null;

photoInput.addEventListener("change", async () => {
  const [file] = photoInput.files || [];
  selectedImageBitmap?.close();
  selectedImageBitmap = null;

  if (!file || !file.type.startsWith("image/") || file.type === "image/svg+xml" || !previewContext) {
    scoreButton.disabled = true;
    previewCanvas.hidden = true;
    return;
  }

  try {
    selectedImageBitmap = await createImageBitmap(file);
    const previewScale = Math.min(
      MAX_IMAGE_DIMENSION / selectedImageBitmap.width,
      MAX_IMAGE_DIMENSION / selectedImageBitmap.height,
      1
    );
    previewCanvas.width = Math.max(1, Math.floor(selectedImageBitmap.width * previewScale));
    previewCanvas.height = Math.max(1, Math.floor(selectedImageBitmap.height * previewScale));
    previewContext.drawImage(selectedImageBitmap, 0, 0, previewCanvas.width, previewCanvas.height);
    previewCanvas.hidden = false;
    result.hidden = true;
    scoreButton.disabled = false;
  } catch {
    selectedImageBitmap = null;
    scoreButton.disabled = true;
    previewCanvas.hidden = true;
  }
});

scoreButton.addEventListener("click", () => {
  if (!selectedImageBitmap || !previewContext) return;

  const canvas = document.createElement("canvas");
  const scale = Math.min(MAX_IMAGE_DIMENSION / selectedImageBitmap.width, MAX_IMAGE_DIMENSION / selectedImageBitmap.height, 1);
  canvas.width = Math.max(1, Math.floor(selectedImageBitmap.width * scale));
  canvas.height = Math.max(1, Math.floor(selectedImageBitmap.height * scale));

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return;
  context.drawImage(selectedImageBitmap, 0, 0, canvas.width, canvas.height);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);

  const score = scoreRoomFromPixels(pixels);
  scoreValue.textContent = String(score);
  scoreSummaryEl.textContent = scoreSummary(score);
  result.hidden = false;
});

window.addEventListener("beforeunload", () => {
  selectedImageBitmap?.close();
});
