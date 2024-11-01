# Fluent UI for VsCode ChangeLog

## 4.3.0 (2024-11-01)

### Fixed

-   Fixed an issue where the extension could not run properly.
-   Fixed an issue where the source control sidebar was appearing beneath the code view.

### Chore

-   Updated import statements and function calls.
-   Improved error handling and resolved test running errors.
-   Updated ESLint configuration and package settings.
-   Removed unused code and related files.

## 4.2.1 (2024-06-15)

1. Update the README file.
2. Update the extension icon.

## 4.2.0 (2024-06-10)

1.  Adjust icon misalignment.

    -   Address alignment issues with icons to ensure they are displayed correctly.

2.  Remove black background on sides when using centered layout.

    -   Remove the black side panels that appear when employing a centered layout to prevent
        distractions and maintain focus on the central content.

3.  Add rounded corners to the editing area when using centered layout.

    -   Introduce rounded corners to the editing area in the centered layout to enhance the
        aesthetic appeal.

4.  Correct the erroneous background colors of certain buttons.

    -   Fix the background colors of specific buttons that are currently incorrect.

## 4.1.1 (2024-06-04)

-   Fix command not found error.

## 4.1.0 (2024-05-27)

-   Adjust the fillet transition between the path column and the editor container.
-   Adjust the tabs and path column white space between.
-   Adjust the color overlap error for selected items in the sidebar.

## 4.0.0 (2024-05-25)

-   Fix terminal tabs cut off
    -   [Repair Source](https://github.com/TheOld/vscode-fluent-ui/issues/56)
-   Fix search widget replacement input cut off
    -   [Repair Source](https://github.com/TheOld/vscode-fluent-ui/pull/58)
-   Fix sidebar shifts the contents of the bar upwards
    -   [Repair Source](https://github.com/TheOld/vscode-fluent-ui/pull/59)

## 3.8.0 (2022-10-21)

-   Optional features can now be controlled via settings.
-   Added support for custom colors (accent, dark and light background)
-   General bug fixes and minor UI adjustments

## 3.6.1 (2022-10-19)

-   Fixed wrong delay value set on sidebar transition

## 3.6.0 (2022-10-13)

-   Added faux-Mica material implementation
-   Multiple UI fixes and adjustments to better align with Fluent UI guidelines
-   Custom styles are now injected into the `<header>` tag allowing for a slight startup perfomance
    gain while making the styles render much earlier.
-   Improved backup and backup restore functionality. Should be more robust and reliable now.
-   Fixed CSS background declaration on many instances, which was causing the background effects to
    not work as intended
-   Fixed activity bar icon spacing in compact mode
-   General style updates and other minor fixes

## 3.1.1 (2022-10-11)

-   Updated ReadMe

## 3.1.0 (2022-10-11)

-   Updated styles and fixed inconsistencies
-   Caret colour is no longer hard-coded and will respect color set by either the syntax theme or
    user config

## 3.0.0 (2022-10-11)

-   Refactored codebase; Now using TypeScript;
-   Fixed issues with deployment due to changed folder path
-   Eliminated some irrelevant dependencies

## 0.3.12 (2021-09-10)

-   Removed What's New page

## 0.3.10 (2021-08-25)

-   Changed file path resolution for What's New page

## 0.3.9 (2021-08-23)

-   Decreased transparency of menus on dark mode

## 0.3.8 (2021-08-19)

-   New dynamic mode. Changing from a light based syntax to a dark based one (and vice-versa) will
    cause the workbench theme to also change

## 0.3.7 (2021-08-18)

-   New compact mode! You can toggle between regular and compact modes in settings.
-   Removed some unecessary overrides that were conflicting with decorations
-   Whats new page

## 0.3.6 (2021-08-16)

-   Dark mode fixes for integrated terminal
-   Decreased transparency on Dark mode

## 0.3.5 (2021-08-16)

-   Fixed item spacing on sidebar
-   Added option to toggle filter effects on and off.
-   Better integrated Breadcrumbs
-   Bottom panel (Terminal/Output, etc) fully integrated - background colour must be set via
    settings for proper best results
-   General layout updates and consistency.

## 0.3.3 (2021-08-13)

-   Fixed: Custom styles were being removed when closing VSCode
