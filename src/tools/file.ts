import { statSync } from 'fs';
import path from 'path';

import { window, env } from 'vscode';

import messages from '../messages';

interface WorkbenchPaths {
    htmlFile: string;
    backupHtmlFile: string;
    workbenchJsFile: string;
}

/** Get the workbench directory and html file */
export function locateWorkbench(): WorkbenchPaths | null {
    const basePath = path.join(env.appRoot, 'out', 'vs', 'code');
    console.log(`Looking for workbench files in: ${basePath}`);

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
            const htmlPathCandidate = path.join(basePath, workbenchDirCandidate, htmlFileNameCandidate);
            try {
                const stat = statSync(htmlPathCandidate);
                if (!stat.isFile()) {
                    // As far as I know, there should never be a directory with a .html suffix.
                    // We shouldn't exit the loop here, because still might be a valid workbench file
                    window.showInformationMessage(htmlPathCandidate + messages.workbenchPathIsDirectory);
                    continue;
                }
                return {
                    htmlFile: htmlPathCandidate,
                    backupHtmlFile: path.join(workbenchDirCandidate, 'workbench.bak.html'),
                    workbenchJsFile: path.join(workbenchDirCandidate, 'fui.js'),
                };
            } catch (error: Error | any) {
                if (error.code !== 'ENOENT') {
                    // As long as the error is not "file not found", we should log it
                    // We shouldn't exit the loop here, because still might be a valid workbench file
                    window.showInformationMessage(`${messages.workbenchPathFailedStat} ${error}`);
                }
                continue;
            }
        }
    }

    window.showErrorMessage(messages.workbenchPathLookupFailed);
    return null;
}
