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

/** Wallpaper options and image processing */
const wallpaperFormats = ['jpeg', 'png', 'webp'] as const satisfies readonly string[];

/** Wallpaper resolution type */
type WallpaperResolution = (typeof wallpaperResolutions)[number];

/** Wallpaper format type */
type WallpaperFormat = (typeof wallpaperFormats)[number];

/** Default blur amount for wallpaper */
const defaultBlur = 50;

/** Default quality for wallpaper */
const defaultQuality = 80;

/** Default wallpaper resolution */
const defaultWallpaperResolution: WallpaperResolution = 'original';

/** Default wallpaper format */
const defaultWallpaperFormat: WallpaperFormat = 'jpeg';

/** Minimum blur amount */
const minBlur = 0;

/** Maximum blur amount */
const maxBlur = 100;

/** Minimum quality */
const minQuality = 1;

/** Maximum quality */
const maxQuality = 100;

/** Maximum sigma for blur effect */
const maxSigma = 100;

/** Error messages related to wallpaper processing. */
const errorMessageList = {
    wallpaperNotFound: 'Wallpaper image not found: ',
    wallpaperProcessingError: 'Error processing wallpaper image: ',
    wallpaperFormatsUnsupported: 'The specified wallpaper image format is not supported: ',
    wallpaperUnknownError: 'An unknown error occurred while processing the wallpaper image.',
    wallpaperUnusable: 'The specified wallpaper image could not be used.',
} as const satisfies Record<string, string>;

/**
 * Options for wallpaper image processing.
 */
interface WallpaperOptions {
    /** Amount of blur to apply to the wallpaper (minBlur - maxBlur). */
    blurAmount: number;
    /** Quality of the wallpaper image (minQuality - maxQuality). */
    quality: number;
    /** Resolution of the wallpaper image. */
    resolution: WallpaperResolution;
    /** Format of the wallpaper image. */
    format: WallpaperFormat;
}

/**
 * Normalizes the wallpaper settings by applying default values and constraints.
 * @param options The partial wallpaper options to normalize.
 * @returns The normalized wallpaper options.
 */
function normalizeWallpaperSettings(
    options: Partial<WallpaperOptions>,
): Readonly<WallpaperOptions> {
    const { blurAmount, quality, resolution, format } = options;
    const blurValue =
        typeof blurAmount === 'number' && Number.isFinite(blurAmount) ? blurAmount : defaultBlur;
    const qualityValue =
        typeof quality === 'number' && Number.isFinite(quality) ? quality : defaultQuality;
    const clampedBlurAmount = Math.min(maxBlur, Math.max(minBlur, blurValue));
    const clampedQuality = Math.round(Math.min(maxQuality, Math.max(minQuality, qualityValue)));
    const validResolution: WallpaperResolution =
        typeof resolution === 'string' && wallpaperResolutions.includes(resolution)
            ? resolution
            : defaultWallpaperResolution;
    const validFormat: WallpaperFormat =
        typeof format === 'string' && wallpaperFormats.includes(format)
            ? format
            : defaultWallpaperFormat;

    return {
        blurAmount: clampedBlurAmount,
        quality: clampedQuality,
        resolution: validResolution,
        format: validFormat,
    } as const satisfies WallpaperOptions;
}

/**
 * Gets the wallpaper options from the workspace configuration.
 * @param config The workspace configuration.
 * @returns The wallpaper options.
 */
function getWallpaperOptions(config: WorkspaceConfiguration): Readonly<WallpaperOptions> {
    const rawBlur = config.get<number>('wallpaperBlurAmount', defaultBlur);
    const rawQuality = config.get<number>('wallpaperQuality', defaultQuality);
    const rawResolution = config.get<WallpaperResolution>(
        'wallpaperResolution',
        defaultWallpaperResolution,
    );
    const rawFormat = config.get<WallpaperFormat>('wallpaperFormat', defaultWallpaperFormat);

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
 * @returns The base64 representation of the processed image or null if the image could not be processed.
 */
async function encodeImageToBase64(
    wallPath: string,
    options: WallpaperOptions,
): Promise<string | null> {
    try {
        // Validate wallpaper path to avoid silently returning false on empty strings
        if (!wallPath || wallPath.trim() === '') {
            throw new Error('wallpaperPathEmpty');
        }

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
            const sigma = map(blurAmount, minBlur, maxBlur, 0.3, maxSigma, true);
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
                // Convert quality (minQuality-maxQuality) to compression level (9-0)
                const compressionLevel = Math.round(
                    map(quality, minQuality, maxQuality, 9, 0, true),
                );
                processedImage = await sharpInstance.png({ compressionLevel }).toBuffer();
                break;
            }
            case 'webp': {
                processedImage = await sharpInstance.webp({ quality }).toBuffer();
                break;
            }
            default: {
                throw new Error(errorMessageList.wallpaperFormatsUnsupported + format);
            }
        }

        return `data:image/${format};base64,${processedImage.toString('base64')}`;
    } catch (e) {
        if (e instanceof Error) {
            const { message } = e;
            if (
                message.includes('Input file is missing') ||
                message.includes('wallpaperPathEmpty')
            ) {
                // File not found
                let path = wallPath;
                if (!path || path.trim() === '') {
                    path = '(empty path)';
                }
                window.showErrorMessage(errorMessageList.wallpaperNotFound + path);
            } else if (message.includes(errorMessageList.wallpaperFormatsUnsupported)) {
                window.showErrorMessage(message);
            } else {
                window.showErrorMessage(errorMessageList.wallpaperProcessingError + message);
            }
        } else {
            window.showErrorMessage(errorMessageList.wallpaperUnknownError);
        }
        return null;
    }
}

/**
 * Creates a base64 string of the wallpaper image based on the provided configuration.
 * @param wallPath The file path of the wallpaper image.
 * @param config The workspace configuration.
 * @returns The base64 representation of the wallpaper image or null if it could not be processed.
 */
export default function createBase64FromWallpaper(
    wallPath: string,
    config: WorkspaceConfiguration,
): Promise<string | null> {
    return encodeImageToBase64(wallPath, getWallpaperOptions(config));
}

export { errorMessageList as wallpaperErrorMessageList };
