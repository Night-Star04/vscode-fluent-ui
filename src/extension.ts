import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

import sharp from 'sharp';
import { type ExtensionContext, commands, window, workspace } from 'vscode';

import { createBackup, deleteBackupFiles, getBackupUuid, restoreBackup } from './backup-helper';
import { messages } from './messages';
import { backupHtmlFilePath, fetchHtmlFile, workbenchJsFilePath } from './tools/file';

function enabledRestart() {
    window
        .showInformationMessage(messages.enabled, { title: messages.restartIde })
        .then(reloadWindow);
}

function restart() {
    window
        .showInformationMessage(messages.disabled, { title: messages.restartIde })
        .then(reloadWindow);
}

function reloadWindow() {
    // reload vscode-window
    commands.executeCommand('workbench.action.reloadWindow');
}

/**
 * Removes injected files from workbench.html file
 * @param  {} html
 */
function clearHTML(html: string) {
    html = html.replace(/<!-- FUI-CSS-START -->[\s\S]*?<!-- FUI-CSS-END -->\n*/, '');
    html = html.replace(/<!-- FUI-ID -->\n*/g, '');

    return html;
}

/**
 * Builds a CSS tag to be injected into the main HTML document
 * @remarks In production mode, the file has been compressed using esbuild, so it can be read directly.
 * @param {string} url - The URL of the CSS file to be injected
 */
async function buildCSSTag(url: string) {
    try {
        const fileName = join(__dirname, url);
        const fileContent = await readFile(fileName);
        return `<style>${fileContent}</style>\n`;
    } catch (error) {
        window.showErrorMessage(String(error));
        window.showWarningMessage(messages.cannotLoad + url);
        return undefined;
    }
}

export async function getBase64Image(wallPath: string) {
    try {
        if (wallPath) {
            const blurredImage = await sharp(wallPath).blur(100).toBuffer();

            return `data:image/png;base64,${blurredImage.toString('base64')}`;
        }

        return false;
    } catch (e) {
        window.showInformationMessage(messages.admin);
        throw e;
    }
}

async function getCSSTag() {
    const config = workspace.getConfiguration('fluentui');
    const activeTheme = window.activeColorTheme;
    const isDark = activeTheme.kind === 2;
    // const isCompact = config.get<boolean>('compact', false);
    const enableBg = config.get<boolean>('enableWallpaper', false);
    const bgURL = config.get<string>('wallpaperPath', '');

    const accent = `${config.get<string>('accent', '#005fb8')}`;
    const darkBgColor = `${config.get<string>('darkBackground', '#202020')}b3`;
    const lightBgColor = `${config.get<string>('lightBackground', '#ffffff')}b3`;

    let encodedImage: boolean | string = false;

    if (enableBg) {
        encodedImage = await getBase64Image(bgURL);
    }

    let res = '';

    const styles = ['/css/editor_chrome.css', isDark ? '/css/dark_vars.css' : ''];

    for (const url of styles) {
        let imp = await buildCSSTag(url);

        if (imp) {
            if (url.includes('dark')) {
                imp = imp.replace('CARD_DARK_BG_COLOR', darkBgColor);
            } else {
                imp = imp.replace('CARD_LIGHT_BG_COLOR', lightBgColor);
                imp = imp.replace('ACCENT_COLOR', accent);
            }

            if (!enableBg) {
                imp = imp.replace('APP_BG', 'transparent');
            } else {
                imp = imp.replace('APP_BG', 'var(--card-bg)');
            }

            res += imp;
        }
    }

    if (encodedImage) {
        // Replace --app-bg value on res
        res = res.replace('dummy', encodedImage);
    }

    return res;
}

/**
 * Builds the JS file to be injected into the main HTML document
 *
 * @remarks In production mode, the file has been compressed using esbuild, so it can be read directly and injected.
 * @param {string} jsFile - The path to the JS file to be built
 */
async function buildJsFile(jsFile: string) {
    try {
        const url = '/js/theme_template.js';
        const config = workspace.getConfiguration('fluentui');
        const jsTemplate = await readFile(__dirname + url);
        let buffer = jsTemplate.toString();

        const isCompact = config.get('compact');
        const accent = `${config.get('accent')}`;
        const darkBgColor = `${config.get('darkBackground')}b3`;
        const lightBgColor = `${config.get('lightBackground')}b3`;

        buffer = buffer.replace(/\[IS_COMPACT\]/g, String(isCompact));
        buffer = buffer.replace(/\[LIGHT_BG\]/g, `"${lightBgColor}"`);
        buffer = buffer.replace(/\[DARK_BG\]/g, `"${darkBgColor}"`);
        buffer = buffer.replace(/\[ACCENT\]/g, `"${accent}"`);

        await writeFile(jsFile, buffer, 'utf-8');

        return;
    } catch (error) {
        window.showErrorMessage(String(error));
        return;
    }
}

/**
 * Loads the CSS and JS file's contents to be injected into the main HTML document
 */
interface PatchArgs {
    htmlFile: string;
    jsFile: string;
    bypassMessage?: boolean;
}

async function patch({ htmlFile, jsFile, bypassMessage }: PatchArgs) {
    let html = await readFile(htmlFile, 'utf-8');
    html = clearHTML(html);

    const styleTags = await getCSSTag();
    // Inject style tag into <head>
    html = html.replace(/(<\/head>)/, '\n' + styleTags + '\n</head>');

    await buildJsFile(jsFile);
    // Inject JS tag into <body>
    html = html.replace(/(<\/html>)/, '\n' + '<script src="fui.js"></script>' + '\n</html>');

    try {
        await writeFile(htmlFile, html, 'utf-8');

        if (bypassMessage) {
            reloadWindow();
        } else {
            enabledRestart();
        }
    } catch (e) {
        window.showInformationMessage(messages.admin);
    }
}

export function activate(context: ExtensionContext) {
    const htmlFile = fetchHtmlFile();
    const htmlBakFile = backupHtmlFilePath;
    const jsFile = workbenchJsFilePath;

    /**
     * Installs full version
     */
    async function install(bypassMessage?: boolean) {
        if (!bypassMessage) {
            const backupUuid = await getBackupUuid(htmlFile);
            if (backupUuid) {
                window.showInformationMessage(messages.alreadySet);
                return;
            }
        }

        await createBackup(htmlFile);
        await patch({ htmlFile, jsFile, bypassMessage });
    }

    async function uninstall() {
        await clearPatch();
        restart();
    }

    async function clearPatch() {
        try {
            await restoreBackup(htmlBakFile, htmlFile);
            await deleteBackupFiles(htmlBakFile, jsFile);
        } catch (error) {
            window.showErrorMessage(String(error));
        }
    }

    const installFUI = commands.registerCommand('fluentui.enableEffects', install);
    const reloadFUI = commands.registerCommand('fluentui.reloadEffects', async () => {
        await clearPatch();
        install(true);
    });
    const uninstallFUI = commands.registerCommand('fluentui.disableEffects', uninstall);

    context.subscriptions.push(installFUI);
    context.subscriptions.push(reloadFUI);
    context.subscriptions.push(uninstallFUI);
}

// This method is called when your extension is deactivated
export function deactivate() {
    // No need to do anything here
}
