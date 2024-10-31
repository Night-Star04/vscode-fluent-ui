import { existsSync } from 'fs';
import path from 'path';

import { window } from 'vscode';

import messages from '../messages';

/** Get the workbench directory */
export function getWorkbenchDir() {
    const appDir = require.main
        ? path.dirname(require.main.filename)
        : globalThis._VSCODE_FILE_ROOT || '';
    if (!appDir) {
        window.showInformationMessage(messages.pathLookupFailed);
    }
    const base = path.join(appDir, 'vs', 'code');
    return path.join(base, 'electron-sandbox', 'workbench');
}

/** Get workbench html file path */
export function fetchHtmlFile() {
    const workbenchDir = getWorkbenchDir();
    let htmlFile = path.join(workbenchDir, 'workbench.html');
    if (!existsSync(htmlFile)) {
        htmlFile = path.join(workbenchDir, 'workbench.esm.html');
    }
    return htmlFile;
}

/** Js file path */
export const workbenchJsFilePath = path.join(getWorkbenchDir(), 'fui.js');

/** Html backup file path */
export const backupHtmlFilePath = path.join(getWorkbenchDir(), 'workbench.bak.html');
