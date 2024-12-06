import fs from 'fs/promises';
import { build, context } from 'esbuild';
import { glob } from 'glob';

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

/**
 * Clear the output directory
 * @remarks This function is a no-op in development mode
 */
async function clearOutput() {
    if (!production) {
        return Promise.resolve();
    }
    return fs.rm('out', { recursive: true, force: true });
}

/** Build the extension */
async function buildExtension() {
    const ctx = await context({
        tsconfig: './tsconfig.json',
        entryPoints: ['./src/extension.ts'],
        bundle: true,
        format: 'cjs',
        minify: production,
        sourcemap: !production,
        sourcesContent: false,
        platform: 'node',
        target: 'es2022',
        outfile: 'out/main.js',
        external: ['vscode', 'sharp', 'uglify-js'],
        logLevel: 'silent',
    });

    if (watch) {
        console.log('Watching for changes...');
        ctx.rebuild();
    } else {
        await ctx.rebuild();
        await ctx.dispose();
    }
}

/** Build the CSS */
async function buildCss() {
    return await build({
        entryPoints: glob.sync('./src/css/*.css'),
        minify: production,
        outdir: 'out/css',
    });
}

/** Build the JS */
async function buildJs() {
    return await build({
        entryPoints: glob.sync('./src/js/*.js'),
        minify: production,
        outdir: 'out/js',
    });
}

/** Main function */
async function main() {
    await clearOutput(); // Clear the output directory
    Promise.all([buildExtension(), buildCss(), buildJs()])
        .then(() => {
            console.log('✔ [SUCCESS] Build completed successfully');
        })
        .catch((err) => {
            console.error(`✘ [ERROR] ${err.message}`);
            process.exit(1);
        });
}

main();
