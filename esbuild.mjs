import { rm } from 'fs/promises';

import { context } from 'esbuild';
import { glob } from 'glob';

const { argv } = process;
const isProductionMode = argv.includes('--production');
const isWatchMode = argv.includes('--watch');

/**
 * Clear the output directory
 * @remarks This function is a no-op in development mode
 */
async function clearOutput() {
    if (!isProductionMode) {
        return;
    }
    return rm('out', { recursive: true, force: true });
}

/**
 * Perform a build task
 *
 * @param {import('esbuild').BuildContext} ctx - The build context
 */
async function performBuildTask(ctx) {
    if (isWatchMode) {
        await ctx.watch();
    } else {
        await ctx.rebuild();
        await ctx.dispose();
    }
}

/** Build the extension */
async function buildExtension() {
    const logLevel = isProductionMode ? 'silent' : 'info';
    const ctx = await context({
        tsconfig: './tsconfig.json',
        entryPoints: ['./src/extension.ts'],
        bundle: true,
        format: 'cjs',
        minify: isProductionMode,
        sourcemap: !isProductionMode,
        sourcesContent: false,
        platform: 'node',
        target: 'es2022',
        outfile: 'out/main.js',
        external: ['vscode', 'sharp'],
        logLevel,
    });

    return performBuildTask(ctx);
}

/** Build the CSS files, used for minifying. */
async function buildCss() {
    const cssFiles = glob.sync('./src/css/*.css');
    if (cssFiles.length === 0) {
        throw new Error('No CSS files found in ./src/css/');
    }
    const ctx = await context({
        entryPoints: cssFiles,
        minify: isProductionMode,
        outdir: 'out/css',
    });

    return performBuildTask(ctx);
}

/** Build the JS files, used for minifying. */
async function buildJs() {
    const jsFiles = glob.sync('./src/js/*.js');
    if (jsFiles.length === 0) {
        throw new Error('No JS files found in ./src/js/');
    }
    const ctx = await context({
        entryPoints: jsFiles,
        minify: isProductionMode,
        outdir: 'out/js',
    });

    return performBuildTask(ctx);
}

/** Main function */
async function main() {
    try {
        await clearOutput();
        const results = await Promise.allSettled([buildExtension(), buildCss(), buildJs()]);
        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                console.error(`✘ [ERROR] Build task ${index + 1} failed`);
                console.error(result.reason);
            }
        });

        if (!isWatchMode) {
            console.log('✔ [SUCCESS] Build completed successfully');
        }
    } catch (err) {
        console.error('✘ [ERROR] Build failed');
        console.error(err);
    }
}

main();
