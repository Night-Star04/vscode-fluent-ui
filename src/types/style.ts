/**
 * Type definitions for the window controls style.
 *
 * @remark
 * This type is used to define the style of window controls in the VS Code workbench.
 *
 * Options:
 * - `native`: Use the native window controls style.
 * - `custom`: Use a custom drawn style for the window controls.
 * - `hidden`: Hide the window controls altogether.
 *
 * @see {@link vscode://settings/window.controlsStyle} for setting options.
 */
export type ControlsStyle = 'native' | 'custom' | 'hidden' | 'none';
