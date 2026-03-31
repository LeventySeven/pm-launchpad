/**
 * Shared avatar accent color utilities.
 * Extracts the dominant hue from an avatar image and generates accent color pairs.
 * Results are cached by URL to avoid repeated canvas operations.
 */

const hueCache = new Map<string, number | null>();

const hashStringToInt = (value: string) => {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

export const accentPairFromSeed = (seed: string) => {
  const h = hashStringToInt(seed);
  const hueA = h % 360;
  const hueB = (hueA + 32 + ((h >> 8) % 48)) % 360;
  return {
    a: `hsla(${hueA}, 85%, 58%, 0.20)`,
    b: `hsla(${hueB}, 85%, 58%, 0.16)`,
    edgeA: `hsla(${hueA}, 85%, 58%, 0.75)`,
    edgeB: `hsla(${hueB}, 85%, 58%, 0.65)`,
  };
};

export const accentPairFromHue = (hueA: number) => {
  const hueB = (hueA + 28) % 360;
  return {
    a: `hsla(${hueA}, 85%, 58%, 0.20)`,
    b: `hsla(${hueB}, 85%, 58%, 0.16)`,
    edgeA: `hsla(${hueA}, 85%, 58%, 0.75)`,
    edgeB: `hsla(${hueB}, 85%, 58%, 0.65)`,
  };
};

const hueFromRgb = (r: number, g: number, b: number) => {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  if (d < 1e-9) return 0;
  let h = 0;
  if (max === rn) h = ((gn - bn) / d) % 6;
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;
  h *= 60;
  if (h < 0) h += 360;
  return h;
};

/** Sample the dominant hue from an avatar image. Cached by URL. */
export const sampleAvatarHue = async (src: string): Promise<number | null> => {
  if (hueCache.has(src)) return hueCache.get(src) ?? null;
  try {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.referrerPolicy = "no-referrer";
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject();
      img.src = src;
    });
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) { hueCache.set(src, null); return null; }
    ctx.drawImage(img, 0, 0, 1, 1);
    const data = ctx.getImageData(0, 0, 1, 1).data;
    const hue = hueFromRgb(data[0] ?? 0, data[1] ?? 0, data[2] ?? 0);
    hueCache.set(src, hue);
    return hue;
  } catch {
    hueCache.set(src, null);
    return null;
  }
};
