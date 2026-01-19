import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

import { type ExtensionContext, ConfigurationTarget, commands, window, workspace } from 'vscode';

import { createBackup, deleteBackupFiles, getBackupUuid, restoreBackup } from './backup-helper';
import { messages } from './messages';
import { locateWorkbench } from './tools/file';
import type { ControlsStyle } from './types/style';
import { IsPatched } from './types/globalState';
import processUpdateEffects from './tools/updates';
import createBase64FromWallpaper from './wallpaper';

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

    let encodedImage: string | null = null;

    if (enableBg) {
        encodedImage = await createBase64FromWallpaper(bgURL, config);
        if (encodedImage === null) {
            window.showErrorMessage(messages.wallpaper.wallpaperUnusable);
        }
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

    if (enableBg && encodedImage !== null) {
        // Replace --app-bg-img value on res (in ./css/editor_chrome.css#L54)
        res = res.replace('--app-bg-img: url(dummy);', `--app-bg-img: url(${encodedImage});`);
    } else {
        // Remove --app-bg-img line
        res = res.replace('--app-bg-img: url(dummy);', '');
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

async function patch(globalState: ExtensionContext['globalState'], bypassMessage = false) {
    const workbench = locateWorkbench();
    if (!workbench) {
        return;
    }

    const { htmlFile, workbenchJsFile } = workbench;

    let html = await readFile(htmlFile, 'utf-8');
    html = clearHTML(html);

    const styleTags = await getCSSTag();
    // Inject style tag into <head>
    html = html.replace(/(<\/head>)/, `\n${styleTags}\n</head>`);

    await buildJsFile(workbenchJsFile);
    // Inject JS tag into <body>
    html = html.replace(/(<\/html>)/, '\n<script src="fui.js"></script>\n</html>');

    try {
        await writeFile(htmlFile, html, 'utf-8');
        globalState.update(IsPatched, true);

        if (bypassMessage) {
            reloadWindow();
        } else {
            enabledRestart();
        }
    } catch (e) {
        window.showInformationMessage(messages.admin);
    }
}

async function clearPatch(globalState: ExtensionContext['globalState']) {
    const workbench = locateWorkbench();
    if (!workbench) {
        return;
    }

    const { htmlFile, backupHtmlFile, workbenchJsFile } = workbench;

    try {
        await restoreBackup(backupHtmlFile, htmlFile);
        await deleteBackupFiles(backupHtmlFile, workbenchJsFile);
        globalState.update(IsPatched, false);
    } catch (error) {
        window.showErrorMessage(String(error));
    }
}

/**
 * Updates the window controls style configuration from 'native' to 'custom' if currently set to 'native'.
 *
 * @remarks
 * This function checks the current 'window.controlsStyle' configuration setting. If it's set to 'native',
 * it displays an information message to the user and automatically updates the setting to 'custom'
 * in the global configuration.
 *
 * Note: This setting only exists on Windows. On other platforms, this function returns false immediately.
 *
 * @returns `true` if the controls style was updated, `false` if it was already set to 'custom' or on unsupported platforms.
 */
async function updateControlsStyle(): Promise<boolean> {
    const controlsStyle = workspace
        .getConfiguration('window')
        .get<ControlsStyle>('controlsStyle', 'none');
    if (controlsStyle === 'native') {
        window.showInformationMessage(messages.autoUpdateControlsStyle);
        try {
            await workspace
                .getConfiguration('window')
                .update('controlsStyle', 'custom', ConfigurationTarget.Global);
            return true;
        } catch {
            return false;
        }
    }
    return false;
}

export function activate(context: ExtensionContext) {
    // Check for extension/editor updates and display notifications to re-apply patches if necessary
    processUpdateEffects(context);

    /**
     * Installs full version
     */
    async function install(bypassMessage?: boolean) {
        const workbench = locateWorkbench();
        if (!workbench) {
            return;
        }
        const { htmlFile } = workbench;

        if (!bypassMessage) {
            const backupUuid = await getBackupUuid(htmlFile);
            if (backupUuid) {
                const isUpdate = await updateControlsStyle();
                // If `updateControlsStyle` returns false, it means the controls style was already in the desired state,
                // so no update was performed. In this case, we show the `alreadySet` message to inform the user.
                if (!isUpdate) {
                    window.showInformationMessage(messages.alreadySet);
                }
                return;
            }
        }

        await updateControlsStyle();
        await createBackup(htmlFile);
        await patch(context.globalState, bypassMessage);
    }

    async function uninstall() {
        await clearPatch(context.globalState);
        restart();
    }

    const installFUI = commands.registerCommand('fluentui.enableEffects', install);
    const reloadFUI = commands.registerCommand('fluentui.reloadEffects', async () => {
        await clearPatch(context.globalState);
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
