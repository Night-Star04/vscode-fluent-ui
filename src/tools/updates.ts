import { ExtensionContext, version, commands, window } from 'vscode';
import messages from '../messages';
import { LastExtensionVersion, LastEditorVersion, IsPatched } from '../types/globalState';

type UpdateType = 'extension' | 'editor';

/**
 * Represents information about available updates.
 */
type UpdateInfo =
    | {
          /** Indicates that an update is available */
          updated: true;
          /** The type of update (extension or editor) */
          type: UpdateType;
          /** The message to display to the user */
          message: string;
          /** The action text for the user interface */
          action: string;
      }
    | {
          /** Indicates that no update is available */
          updated: false;
      };

/**
 * A partial extension context type containing only the properties needed for update checking.
 */
type Context = Pick<ExtensionContext, 'globalState' | 'extension'>;

/**
 * Applies a global state update for the extension or editor version.
 *
 * @param context - The extension context containing global state and extension properties
 * @param key - The type of update ('editor' or 'extension')
 * @param value - The new version value to store
 * @param isUpdated - Indicates whether to return updated messages
 * @returns An object containing update information
 */
function applyGlobalStateUpdate(
    context: Context,
    key: UpdateType,
    value: string,
    isUpdated: boolean = true,
): UpdateInfo {
    const stateKey = key === 'editor' ? LastEditorVersion : LastExtensionVersion;
    context.globalState.update(stateKey, value);

    if (!isUpdated) {
        return { updated: false };
    }
    switch (key) {
        case 'editor':
            return {
                updated: true,
                type: 'editor',
                message: messages.editorUpdate,
                action: messages.editorUpdateAction,
            };
        case 'extension':
            return {
                updated: true,
                type: 'extension',
                message: messages.extensionUpdate.replace('{version}', value),
                action: messages.extensionUpdateAction,
            };
        default:
            // this should not happen
            return { updated: false };
    }
}

/**
 * Checks for updates to the extension and editor versions.
 *
 * This function compares the current extension and VS Code editor versions
 * with previously stored versions to determine if updates have occurred.
 * When an update is detected, it automatically updates the stored version
 * and returns information about the update.
 *
 * @param context - Partial extension context containing globalState and extension properties
 * @returns An object indicating whether an update is needed and details about the update
 *
 * @remarks
 * The function checks updates in the following order:
 * 1. Extension version (takes priority)
 * 2. VS Code editor version
 *
 * Version information is persisted in the extension's global state using:
 * - `LastExtensionVersion` for tracking extension updates
 * - `LastEditorVersion` for tracking VS Code updates
 *
 * @example
 * ```typescript
 * const updateInfo = checkForUpdates(context);
 * if (updateInfo.updated) {
 *     console.log(`Update detected: ${updateInfo.type}`);
 *     console.log(`Message: ${updateInfo.message}`);
 * }
 * ```
 */
export function checkForUpdates(context: Context): UpdateInfo {
    // get current and last version of extension
    const extensionVersion: string = context.extension.packageJSON.version;
    const extensionLastVersion = context.globalState.get<string>(LastExtensionVersion);

    // get current and last version of the editor
    const editorCurrentVersion = version;
    const editorLastVersion = context.globalState.get<string>(LastEditorVersion);

    if (!extensionLastVersion) {
        // If there is no last extension version stored, we assume this is the first run
        return applyGlobalStateUpdate(context, 'extension', extensionVersion, false);
    }
    if (!editorLastVersion) {
        // If there is no last editor version stored, we assume this is the first run
        return applyGlobalStateUpdate(context, 'editor', editorCurrentVersion, false);
    }

    if (extensionVersion !== extensionLastVersion) {
        return applyGlobalStateUpdate(context, 'extension', extensionVersion);
    } else if (editorCurrentVersion !== editorLastVersion) {
        return applyGlobalStateUpdate(context, 'editor', editorCurrentVersion);
    }

    // If both versions are the same, no update is needed
    return { updated: false };
}

/**
 * Processes update effects based on extension and editor version changes.
 *
 * This function checks for updates to both the extension and VS Code editor,
 * and displays appropriate messages to the user based on the current patch status.
 *
 * @param context - Partial extension context containing globalState and extension properties
 *
 * @remarks
 * The function handles two scenarios:
 * - If the extension is patched: Shows a warning message prompting to re-apply effects
 * - If the extension is not patched: Shows an informational message for extension updates only
 *
 * Editor updates are only shown when the extension is patched, as they require re-patching
 * to maintain compatibility.
 *
 * @example
 * ```typescript
 * export function activate(context: ExtensionContext) {
 *     processUpdateEffects(context);
 *     // ... rest of activation logic
 * }
 * ```
 */
export default function processUpdateEffects(context: Context) {
    const updateInfo = checkForUpdates(context);

    // If there is an update available.
    if (updateInfo.updated) {
        const isPatched = context.globalState.get<boolean>(IsPatched, false);
        if (isPatched) {
            // If the extension is patched, show a warning message with an action to re-enable
            // the effects after applying the update.
            window
                .showWarningMessage(
                    `${updateInfo.message} ${updateInfo.action}?`,
                    updateInfo.action,
                )
                .then((value) => {
                    if (value !== undefined) {
                        commands.executeCommand('fluentui.reloadEffects');
                    }
                });
        } else {
            // If the extension is not patched, just show the update message.
            // If type is 'editor', do not show the message because it is not relevant in this case.
            if (updateInfo.type === 'extension') {
                window.showInformationMessage(updateInfo.message);
            }
        }
    }
}
