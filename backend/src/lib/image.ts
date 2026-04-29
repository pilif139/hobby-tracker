const imageExtensions = ['.jpg', '.png', '.webp', '.jpeg', '.bmp'] as const;

export type ImageFilename = `${string}${(typeof imageExtensions)[number]}`;

export function isValidImageFilename(
  filename: string,
): filename is ImageFilename {
  return imageExtensions.some((ext) => filename.toLowerCase().endsWith(ext));
}

export function getImageContentType(filename: ImageFilename) {
  const ext = filename
    .toLowerCase()
    .split('.')
    .slice(-1)[0] as (typeof imageExtensions)[number];

  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.bmp':
      return 'image/bmp';
  }
}

export class InvalidImageFileExtensionException extends Error {
  constructor() {
    super(
      `Invalid image file extension. Allowed extensions are: ${imageExtensions.join(
        ', ',
      )}`,
    );
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
