import { statSync } from 'fs';
import path from 'path';

import { window, env } from 'vscode';

import messages from '../messages';

interface WorkbenchPaths {
    htmlFile: string;
    backupHtmlFile: string;
    workbenchJsFile: string;
}

// Implementation originally from vscode-custom-css. License available in LICENSE-vscode-custom-css.

/** Get the workbench directory and html file */
export function locateWorkbench(): WorkbenchPaths | null {
    const basePath = path.join(env.appRoot, 'out', 'vs', 'code');

    const workbenchDirCandidates = [
        // old path
        'electron-sandbox',
        path.join('electron-sandbox', 'workbench'),

        // v1.102+ path
        'electron-browser',
        path.join('electron-browser', 'workbench'),
    ];

    const htmlFileNameCandidates = [
        'workbench.html', // VSCode
        'workbench.esm.html', // VSCode ESM
        'workbench-dev.html', // VSCode dev
    ];

    for (const workbenchDirCandidate of workbenchDirCandidates) {
        for (const htmlFileNameCandidate of htmlFileNameCandidates) {
            const htmlPathCandidate = path.join(
                basePath,
                workbenchDirCandidate,
                htmlFileNameCandidate,
            );
            try {
                const stat = statSync(htmlPathCandidate, { throwIfNoEntry: false });
                if (!stat) {
                    // If the file does not exist, we should continue to the next candidate
                    continue;
                }
                if (!stat.isFile()) {
                    // As far as I know, there should never be a directory with a .html suffix.
                    // We shouldn't exit the loop here, because still might be a valid workbench file
                    window.showInformationMessage(
                        htmlPathCandidate + messages.workbenchPathIsDirectory,
                    );
                    continue;
                }
                return {
                    htmlFile: htmlPathCandidate,
                    backupHtmlFile: path.join(
                        basePath,
                        workbenchDirCandidate,
                        'workbench.bak.html',
                    ),
                    workbenchJsFile: path.join(basePath, workbenchDirCandidate, 'fui.js'),
                };
            } catch (error) {
                if (error instanceof Error) {
                    // As long as the error is not "file not found" which is not thrown due to { throwIfNoEntry: false }, we should log it
                    // We shouldn't exit the loop here, because still might be a valid workbench file
                    window.showInformationMessage(
                        `${messages.workbenchPathFailedStat} ${error.message}`,
                    );
                }
            }
        }
    }

    window.showErrorMessage(messages.workbenchPathLookupFailed);
    return null;
}
