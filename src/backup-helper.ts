import * as fs from 'fs/promises';
import * as vscode from 'vscode';

import { backupHtmlFilePath } from './tools/file';
import { messages } from './messages';

/**
 * Deletes backup files matching UUID
 *
 * @param {*} htmlFile
 */
export async function deleteBackupFiles(htmlFile: string, jsFile: string) {
    try {
        // const htmlDir = path.dirname(htmlFile);

        await fs.unlink(htmlFile);
        console.log('Successfully removed backup file');
        await fs.unlink(jsFile);
        console.log('Successfully removed js file');
    } catch (error) {
        vscode.window.showErrorMessage(error);
    }
}

/**
 * Creates a backup file from the current workspace.html
 */
export async function createBackup(htmlFile: string) {
    try {
        const html = await fs.readFile(htmlFile, 'utf-8');

        await fs.writeFile(backupHtmlFilePath, html, 'utf-8');
    } catch (e) {
        vscode.window.showInformationMessage(messages.admin);
        throw e;
    }
}

export async function getBackupUuid(htmlFilePath: string) {
    try {
        const htmlContent = await fs.readFile(htmlFilePath, 'utf-8');

        const match = htmlContent.match(/fui/);

        if (!match) {
            return null;
        } else {
            return match[0];
        }
    } catch (e) {
        vscode.window.showInformationMessage(`${messages.genericError}${e}`);
        return null;
    }
}

/**
 * Restores the backed up workbench.html file
 */
export async function restoreBackup(backupFilePath: string, htmlFile: string) {
    try {
        const stat = await fs.stat(backupFilePath);
        if (stat.isFile()) {
            await fs.unlink(htmlFile);
            await fs.copyFile(backupFilePath, htmlFile);
        }
    } catch (e) {
        vscode.window.showInformationMessage(messages.admin);
        throw e;
    }
}
