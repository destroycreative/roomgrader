function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function scoreRoomFromPixels({ width, height, data }) {
  if (!width || !height || !data?.length) {
    return 0;
  }

  const pixels = width * height;
  let luminanceSum = 0;
  let clutterTransitions = 0;
  let previous = null;

  for (let i = 0; i < data.length; i += 4) {
    const luminance = data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722;
    luminanceSum += luminance;

    if (previous !== null && Math.abs(luminance - previous) > 28) {
      clutterTransitions += 1;
    }
    previous = luminance;
  }

  const avgLuminance = luminanceSum / pixels;
  const transitionRatio = clutterTransitions / Math.max(1, pixels - 1);

  const brightnessScore = clamp((avgLuminance / 255) * 100, 0, 100);
  const organizationScore = clamp((1 - transitionRatio * 3) * 100, 0, 100);
  const score = Math.round(brightnessScore * 0.4 + organizationScore * 0.6);

  return clamp(score, 0, 100);
}

export function scoreSummary(score) {
  if (score >= 85) return "Excellent — this room looks very clean.";
  if (score >= 65) return "Good — mostly tidy with minor clutter.";
  if (score >= 40) return "Fair — visible clutter, consider a quick cleanup.";
  return "Messy — focus on decluttering surfaces and floors.";
}
