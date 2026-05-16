/**
 * Vitest-only stub: same exports as app code uses from @cf-wasm/photon (see vitest.config alias).
 * Fixed 64×64 “decoded” size keeps flows under avatar/session limits without real decoding.
 */

export enum SamplingFilter {
  Nearest = 0,
}

const MOCK_W = 64;
const MOCK_H = 64;

export class PhotonImage {
  constructor(
    private readonly w: number,
    private readonly h: number,
  ) {}

  static new_from_byteslice(buf: Buffer | Uint8Array): PhotonImage {
    void buf;
    return new PhotonImage(MOCK_W, MOCK_H);
  }

  get_width(): number {
    return this.w;
  }

  get_height(): number {
    return this.h;
  }

  get_bytes(): Uint8Array {
    return new Uint8Array(this.w * this.h * 4);
  }

  free(): void {
    void 0;
  }
}

export function resize(
  image: PhotonImage,
  width: number,
  height: number,
  filter: SamplingFilter,
): PhotonImage {
  void image;
  void filter;
  return new PhotonImage(width, height);
}
