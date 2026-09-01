export class SeededPRNG {
  private seed: number;

  constructor(seed: number = 42) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
}

export class PaperNoise {
  private perm: number[] = [];

  constructor(seed: number = 1337) {
    const prng = new SeededPRNG(seed);
    const p: number[] = [];
    for (let i = 0; i < 256; i++) {
      p[i] = Math.floor(prng.next() * 256);
    }
    this.perm = new Array(512);
    for (let i = 0; i < 512; i++) {
      this.perm[i] = p[i & 255];
    }
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(a: number, b: number, t: number): number {
    return a + t * (b - a);
  }

  private grad(hash: number, x: number, y: number, z: number): number {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  noise3D(x: number, y: number, z: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;

    const fx = x - Math.floor(x);
    const fy = y - Math.floor(y);
    const fz = z - Math.floor(z);

    const u = this.fade(fx);
    const v = this.fade(fy);
    const w = this.fade(fz);

    const A = this.perm[X] + Y;
    const AA = this.perm[A] + Z;
    const AB = this.perm[A + 1] + Z;
    const B = this.perm[X + 1] + Y;
    const BA = this.perm[B] + Z;
    const BB = this.perm[B + 1] + Z;

    return this.lerp(
      this.lerp(
        this.lerp(this.grad(this.perm[AA], fx, fy, fz), this.grad(this.perm[BA], fx - 1, fy, fz), u),
        this.lerp(this.grad(this.perm[AB], fx, fy - 1, fz), this.grad(this.perm[BB], fx - 1, fy - 1, fz), u),
        v
      ),
      this.lerp(
        this.lerp(this.grad(this.perm[AA + 1], fx, fy, fz - 1), this.grad(this.perm[BA + 1], fx - 1, fy, fz - 1), u),
        this.lerp(this.grad(this.perm[AB + 1], fx, fy - 1, fz - 1), this.grad(this.perm[BB + 1], fx - 1, fy - 1, fz - 1), u),
        v
      ),
      w
    );
  }

  fbm(x: number, y: number, z: number, octaves = 4, persistence = 0.5, lacunarity = 2.0): number {
    let total = 0;
    let frequency = 1;
    let amplitude = 1;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      total += this.noise3D(x * frequency, y * frequency, z * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }

    return total / maxValue;
  }

  creaseNoise(x: number, y: number, z: number, octaves = 3): number {
    let total = 0;
    let frequency = 1;
    let amplitude = 1;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      const n = this.noise3D(x * frequency, y * frequency, z * frequency);
      const r = 1.0 - Math.abs(n);
      total += r * r * amplitude;
      maxValue += amplitude;
      amplitude *= 0.55;
      frequency *= 2.1;
    }

    return total / maxValue;
  }
}

export const paperNoise = new PaperNoise(982341);

export function calculatePaperVertex(
  ox: number,
  oy: number,
  width: number,
  height: number,
  progress: number
): [number, number, number] {
  const normX = ox / (width / 2);
  const normY = oy / (height / 2);
  const distFromCenter = Math.sqrt(normX * normX + normY * normY);
  const angle = Math.atan2(normY, normX);

  const crumpleRadius = 0.85;
  const phi = (normY * Math.PI * 0.95) + Math.PI * 0.5;
  const theta = (normX * Math.PI * 1.35) + angle * 0.4;

  let cx0 = crumpleRadius * Math.sin(phi) * Math.cos(theta);
  let cy0 = crumpleRadius * Math.cos(phi);
  let cz0 = crumpleRadius * Math.sin(phi) * Math.sin(theta);

  const largeNoise = paperNoise.noise3D(ox * 0.75 + 1.2, oy * 0.75 + 2.5, 0.4);
  const mediumCrease = paperNoise.creaseNoise(ox * 2.2 + 0.5, oy * 2.2 - 0.8, 1.1, 3);
  const microWrinkle = paperNoise.noise3D(ox * 6.5, oy * 6.5, 2.7) * 0.18;

  const foldLine1 = Math.abs(Math.sin(normX * 3.5 + normY * 2.8 + largeNoise * 1.5));
  const foldLine2 = Math.abs(Math.cos(normX * 2.2 - normY * 4.1 + mediumCrease * 1.2));
  const pinchFactor = (1.0 - Math.min(foldLine1, foldLine2)) * 0.45;

  const totalCrumpleDisplacement = (largeNoise * 0.5 + mediumCrease * 0.35 + microWrinkle - pinchFactor * 0.3);
  cx0 += Math.cos(theta) * totalCrumpleDisplacement * 0.45;
  cy0 += Math.sin(angle) * totalCrumpleDisplacement * 0.45;
  cz0 += totalCrumpleDisplacement * 0.6;

  const tuck = Math.sin(normX * 2.5 + normY * 1.8) * 0.25;
  cx0 += tuck * 0.2;
  cz0 += tuck * 0.35;

  const uncurlAngle = (1.0 - normX * 0.5) * Math.PI * 1.2;
  const uncurlRadius = 0.9 + normY * 0.3;
  const rx1 = Math.cos(uncurlAngle) * uncurlRadius + ox * 0.4;
  const ry1 = oy * 0.6 + Math.sin(normX * 2.0) * 0.4;
  const rz1 = Math.sin(uncurlAngle) * uncurlRadius + (largeNoise + mediumCrease) * 0.5;

  const cornerCurl = Math.pow(Math.max(0, distFromCenter - 0.5), 1.8) * 0.5;
  const ux2 = ox * 0.88 + Math.sin(oy * 1.5) * 0.15;
  const uy2 = oy * 0.88 + Math.cos(ox * 1.5) * 0.12;
  const uz2 = (largeNoise * 0.35 + mediumCrease * 0.28) + (Math.sin(ox * 2.0) * 0.25) + cornerCurl;

  const permanentFold1 = (1.0 - Math.abs(Math.sin(ox * 1.8 + oy * 1.2 + 0.4))) * 0.07;
  const permanentFold2 = (1.0 - Math.abs(Math.sin(ox * 2.4 - oy * 1.9 - 0.7))) * 0.055;
  const permanentCreaseField = paperNoise.creaseNoise(ox * 1.6, oy * 1.6, 0.8, 3) * 0.08;
  const permanentMicroWrinkle = paperNoise.noise3D(ox * 5.0, oy * 5.0, 1.5) * 0.035;
  const permanentEdgeBowing = (Math.cos(normX * Math.PI * 0.5) * Math.cos(normY * Math.PI * 0.5)) * 0.03;

  const edgeDistX = Math.abs(normX);
  const edgeDistY = Math.abs(normY);
  const edgeWiggleX = Math.sin(oy * 8.0) * 0.02 * Math.pow(edgeDistX, 3);
  const edgeWiggleY = Math.cos(ox * 8.0) * 0.02 * Math.pow(edgeDistY, 3);

  const fx3 = ox + edgeWiggleX;
  const fy3 = oy + edgeWiggleY;
  const fz3 = (permanentFold1 + permanentFold2 + permanentCreaseField + permanentMicroWrinkle - 0.06) + permanentEdgeBowing;

  let finalX: number;
  let finalY: number;
  let finalZ: number;

  if (progress <= 0.28) {
    const t = progress / 0.28;
    const ease = t * t * (3 - 2 * t);
    finalX = cx0 + (rx1 - cx0) * ease;
    finalY = cy0 + (ry1 - cy0) * ease;
    finalZ = cz0 + (rz1 - cz0) * ease;
  } else if (progress <= 0.72) {
    const t = (progress - 0.28) / (0.72 - 0.28);
    const ease = t * t * (3 - 2 * t);
    finalX = rx1 + (ux2 - rx1) * ease;
    finalY = ry1 + (uy2 - ry1) * ease;
    finalZ = rz1 + (uz2 - rz1) * ease;
  } else {
    const t = (progress - 0.72) / (1.0 - 0.72);
    const ease = 1 - Math.pow(1 - t, 3);
    finalX = ux2 + (fx3 - ux2) * ease;
    finalY = uy2 + (fy3 - uy2) * ease;
    finalZ = uz2 + (fz3 - uz2) * ease;
  }

  return [finalX, finalY, finalZ];
}
