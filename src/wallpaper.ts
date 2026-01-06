import sharp, { type Sharp } from 'sharp';
import { type WorkspaceConfiguration, window } from 'vscode';
import map from './util/map';

/** Available wallpaper resolutions */
const wallpaperResolutions = [
    'original',
    '1920x1080',
    '2560x1440',
    '3840x2160',
    '1920x1200',
    '2560x1600',
    '3840x2400',
] as const satisfies readonly string[];

/** Default wallpaper resolution */
const defaultWallpaperResolutions: (typeof wallpaperResolutions)[number] = 'original';

/** Wallpaper options and image processing */
const wallpaperFormats = ['jpeg', 'png', 'webp'] as const satisfies readonly string[];

/** Default wallpaper format */
const defaultWallpaperFormats: (typeof wallpaperFormats)[number] = 'jpeg';

/** Error messages related to wallpaper processing. */
const errorMessage = {
    wallpaperNotFound: 'Wallpaper image not found: ',
    wallpaperProcessingError: 'Error processing wallpaper image: ',
    wallpaperUnknownError: 'An unknown error occurred while processing the wallpaper image.',
    wallpaperUnusable: 'The specified wallpaper image could not be used.',
} as const satisfies Record<string, string>;

/**
 * Options for wallpaper image processing.
 */
interface WallpaperOptions {
    /* Amount of blur to apply to the wallpaper (0-100). */
    blurAmount: number;
    /* Quality of the wallpaper image (1-100). */
    quality: number;
    /* Resolution of the wallpaper image. */
    resolution: (typeof wallpaperResolutions)[number];
    /* Format of the wallpaper image. */
    format: (typeof wallpaperFormats)[number];
}

/**
 * Normalizes the wallpaper settings by applying default values and constraints.
 * @param options The partial wallpaper options to normalize.
 * @returns The normalized wallpaper options.
 */
function normalizeWallpaperSettings(
    options: Partial<WallpaperOptions>,
): Readonly<WallpaperOptions> {
    const blurAmount = Math.min(
        100,
        Math.max(0, Number.isFinite(options.blurAmount) ? (options.blurAmount as number) : 50),
    );
    const quality = Math.round(
        Math.min(
            100,
            Math.max(1, Number.isFinite(options.quality) ? (options.quality as number) : 80),
        ),
    );
    const resolution: WallpaperOptions['resolution'] =
        typeof options.resolution === 'string' && wallpaperResolutions.includes(options.resolution)
            ? (options.resolution as WallpaperOptions['resolution'])
            : defaultWallpaperResolutions;
    const format: WallpaperOptions['format'] =
        typeof options.format === 'string' && wallpaperFormats.includes(options.format)
            ? (options.format as WallpaperOptions['format'])
            : defaultWallpaperFormats;

    return {
        blurAmount,
        quality,
        resolution,
        format,
    } as const satisfies WallpaperOptions;
}

/**
 * Gets the wallpaper options from the workspace configuration.
 * @param config The workspace configuration.
 * @returns The wallpaper options.
 */
function getWallpaperOptions(config: WorkspaceConfiguration): Readonly<WallpaperOptions> {
    const rawBlur = config.get<number>('wallpaperBlurAmount', 50);
    const rawQuality = config.get<number>('wallpaperQuality', 80);
    const rawResolution = config.get<WallpaperOptions['resolution']>(
        'wallpaperResolution',
        defaultWallpaperResolutions,
    );
    const rawFormat = config.get<WallpaperOptions['format']>(
        'wallpaperFormat',
        defaultWallpaperFormats,
    );

    return normalizeWallpaperSettings({
        blurAmount: rawBlur,
        quality: rawQuality,
        resolution: rawResolution,
        format: rawFormat,
    });
}

/**
 * Encodes an image to a base64 string with specified options.
 * @param wallPath The file path of the wallpaper image.
 * @param options The options to apply to the image.
 * @returns The base64 representation of the processed image or false if the image could not be processed.
 */
async function encodeImageToBase64(
    wallPath: string,
    options: WallpaperOptions,
): Promise<string | false> {
    try {
        if (wallPath) {
            let sharpInstance: Sharp = sharp(wallPath);
            const { blurAmount, quality, resolution, format } = options;

            // Parse and apply resolution
            if (resolution !== 'original') {
                const [width, height] = resolution.split('x').map(Number);
                if (width && height) {
                    sharpInstance = sharpInstance.resize(width, height, {
                        fit: 'cover',
                        position: 'center',
                    });
                }
            }

            // Apply blur if amount > 0
            if (blurAmount > 0) {
                const sigma = map(blurAmount, 0, 100, 0.3, 100);
                sharpInstance = sharpInstance.blur(sigma);
            }

            // Apply format-specific quality settings
            let processedImage: Buffer;
            switch (format) {
                case 'jpeg': {
                    processedImage = await sharpInstance.jpeg({ quality }).toBuffer();
                    break;
                }
                case 'png': {
                    // PNG compression level: 0-9, where 9 is maximum compression
                    // Convert quality (1-100) to compression level (9-0)
                    const compressionLevel = Math.round(map(quality, 1, 100, 9, 0));
                    processedImage = await sharpInstance.png({ compressionLevel }).toBuffer();
                    break;
                }
                case 'webp': {
                    processedImage = await sharpInstance.webp({ quality }).toBuffer();
                    break;
                }
                default: {
                    processedImage = await sharpInstance.jpeg({ quality }).toBuffer();
                    break;
                }
            }

            return `data:image/${format};base64,${processedImage.toString('base64')}`;
        }

        return false;
    } catch (e) {
        if (e instanceof Error) {
            if (e.message.includes('Input file is missing')) {
                // File not found
                window.showErrorMessage(errorMessage.wallpaperNotFound + wallPath);
            } else {
                window.showErrorMessage(errorMessage.wallpaperProcessingError + e.message);
            }
        } else {
            window.showErrorMessage(errorMessage.wallpaperUnknownError);
        }
        throw e;
    }
}

/**
 * Creates a base64 string of the wallpaper image based on the provided configuration.
 * @param wallPath The file path of the wallpaper image.
 * @param config The workspace configuration.
 * @returns The base64 representation of the wallpaper image or false if it could not be processed.
 */
export default function createBase64FromWallpaper(
    wallPath: string,
    config: WorkspaceConfiguration,
): Promise<string | false> {
    return encodeImageToBase64(wallPath, getWallpaperOptions(config));
}

export { errorMessage as wallpaperErrorMessage };
