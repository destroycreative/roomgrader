import { scoreRoomFromPixels, scoreSummary } from "./roomScore.js";

const photoInput = document.getElementById("photoInput");
const preview = document.getElementById("preview");
const scoreButton = document.getElementById("scoreButton");
const result = document.getElementById("result");
const scoreValue = document.getElementById("scoreValue");
const scoreSummaryEl = document.getElementById("scoreSummary");

let imageReady = false;

photoInput.addEventListener("change", () => {
  const [file] = photoInput.files || [];
  if (!file) {
    imageReady = false;
    scoreButton.disabled = true;
    preview.hidden = true;
    return;
  }

  preview.src = URL.createObjectURL(file);
  preview.hidden = false;
  result.hidden = true;
  imageReady = true;
  scoreButton.disabled = false;
});

scoreButton.addEventListener("click", async () => {
  if (!imageReady) return;
  await preview.decode();

  const canvas = document.createElement("canvas");
  const maxDimension = 300;
  const scale = Math.min(maxDimension / preview.naturalWidth, maxDimension / preview.naturalHeight, 1);
  canvas.width = Math.max(1, Math.floor(preview.naturalWidth * scale));
  canvas.height = Math.max(1, Math.floor(preview.naturalHeight * scale));

  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(preview, 0, 0, canvas.width, canvas.height);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);

  const score = scoreRoomFromPixels(pixels);
  scoreValue.textContent = String(score);
  scoreSummaryEl.textContent = scoreSummary(score);
  result.hidden = false;
});
