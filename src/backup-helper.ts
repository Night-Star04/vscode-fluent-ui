import { copyFile, readFile, stat, unlink, writeFile } from 'fs/promises';

import { window } from 'vscode';

import { messages } from './messages';
import { backupHtmlFilePath } from './tools/file';

/**
 * Deletes backup files matching UUID
 *
 * @param {*} htmlFile
 */
export async function deleteBackupFiles(htmlFile: string, jsFile: string) {
    try {
        await unlink(htmlFile);
        console.log('Successfully removed backup file');
        await unlink(jsFile);
        console.log('Successfully removed js file');
    } catch (error) {
        window.showErrorMessage(error);
    }
}

/**
 * Creates a backup file from the current workspace.html
 */
export async function createBackup(htmlFile: string) {
    try {
        const html = await readFile(htmlFile, 'utf-8');

        await writeFile(backupHtmlFilePath, html, 'utf-8');
    } catch (e) {
        window.showInformationMessage(messages.admin);
        throw e;
    }
}

export async function getBackupUuid(htmlFilePath: string) {
    try {
        const htmlContent = await readFile(htmlFilePath, 'utf-8');

        const match = htmlContent.match(/fui/);

        if (!match) {
            return null;
        } else {
            return match[0];
        }
    } catch (e) {
        window.showInformationMessage(`${messages.genericError}${e}`);
        return null;
    }
}

/**
 * Restores the backed up workbench.html file
 */
export async function restoreBackup(backupFilePath: string, htmlFile: string) {
    try {
        const fileStats = await stat(backupFilePath);
        if (fileStats.isFile()) {
            await unlink(htmlFile);
            await copyFile(backupFilePath, htmlFile);
        }
    } catch (e) {
        window.showInformationMessage(messages.admin);
        throw e;
    }
}
