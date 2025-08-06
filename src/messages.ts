export const messages = {
    admin: 'You must run VS code with admin privileges in order to enable Fluent UI.',
    enabled: 'Fluent UI is enabled. VS code must reload for this change to take effect.',
    alreadySet: 'Fluent UI is already running!',
    disabled: 'Fluent UI is now disabled. (Requires reload)',
    notRunning: "Fluent UI isn't running.",
    genericError: 'Something went wrong: ',
    restartIde: 'Restart Visual Studio Code',
    cannotLoad: 'Error: ',
    restart: 'You need to reload for the change(s) to take effect.',
    workbenchPathLookupFailed: "Unable to locate VSCode's workbench html file.",
    workbenchPathIsDirectory: ' is a directory, not a file.',
    workbenchPathFailedStat: 'Failed to check workbench path: ',
    autoUpdateControlsStyle:
        'Fluent UI requires the "window.controlsStyle" setting to be set to "custom". This has been done automatically.',
    editorUpdate: 'Fluent UI is invalid due to Editor update. ',
    editorUpdateAction: 'Re-apply the patch',
    extensionUpdate: 'Fluent UI updated to version {version}. ',
    extensionUpdateAction: 'Apply the update',
} as const satisfies Record<string, string>;

export default messages;
