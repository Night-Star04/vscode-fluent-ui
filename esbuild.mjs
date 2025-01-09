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
    await rm('out', { recursive: true, force: true });
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

/**
 * Get the configuration for the build task
 * @param {string} src - The source files
 * @param {string} dest - The destination directory or file
 * @param {boolean} [isFile] - Whether the destination is a file
 * @returns {import('esbuild').BuildOptions}
 */
function generateBundlerConfig(src, dest, isFile = false) {
    const logLevel = isProductionMode ? 'silent' : 'info';

    const entryPoints = isFile ? [src] : glob.sync(src);
    if (entryPoints.length === 0) {
        throw new Error(`No files found at ${src}`);
    }
    const outputConfig = isFile ? { outfile: dest } : { outdir: dest };

    return { entryPoints, minify: isProductionMode, ...outputConfig, logLevel };
}

/** Build the extension */
async function buildExtension() {
    const ctx = await context({
        ...generateBundlerConfig('./src/extension.ts', 'out/main.js', true),
        tsconfig: './tsconfig.json',
        bundle: true,
        format: 'cjs',
        sourcemap: !isProductionMode,
        sourcesContent: false,
        platform: 'node',
        target: 'es2022',
        external: ['vscode', 'sharp'],
    });

    return performBuildTask(ctx);
}

/** Build the CSS files, used for minifying. */
async function buildCss() {
    const ctx = await context(generateBundlerConfig('./src/js/*.js', 'out/css'));

    return performBuildTask(ctx);
}

/** Build the JS files, used for minifying. */
async function buildJs() {
    const ctx = await context(generateBundlerConfig('./src/js/*.js', 'out/js'));

    return performBuildTask(ctx);
}

/**
 * Build tasks
 *
 * @type {Array<{ name: string, task: () => Promise<void> }>}
 */
const buildTasks = [
    { name: 'Extension', task: buildExtension },
    { name: 'CSS', task: buildCss },
    { name: 'JavaScript', task: buildJs },
];

/** Main function */
async function main() {
    try {
        await clearOutput();
        const results = await Promise.allSettled(buildTasks.map((task) => task.task()));

        let isErrorPresent = false;
        results.forEach((result, index) => {
            const taskName = buildTasks[index].name;
            if (result.status === 'fulfilled') {
                console.log(`✔ [SUCCESS] Build completed for ${taskName}`);
            } else {
                isErrorPresent = true;
                console.error(`✘ [ERROR] Build failed for ${taskName}`);
                console.error(result.reason);
            }
        });

        if (isWatchMode) {
            console.log('Watching for changes...');
        }
        if (isErrorPresent) {
            throw new Error('One or more build tasks failed');
        }

        console.log('✔ [SUCCESS] Build completed successfully');
    } catch (err) {
        console.error('✘ [ERROR] Build failed');
        console.error(err);
        process.exit(1);
    }
}

main();
