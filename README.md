# Snail Language Support

The Snail Language Support aims to add language support for the [snail programming language](https://snail-language.github.io/), developed by Assistant Professor [Kevin Angstadt](https://myslu.stlawu.edu/~kangstadt/) at St. Lawrence University. 

---

## Features

Snail Language Support adds a number of features to the snail language

### Static Error Checking

Snail Language Support provides static error checking of lexing and parsing errors. Runtime/Interpreter errors are currently not supported or checked.

![Static Error Checking](images/StaticErrorChecking.png)

### Rudimentary autocomplete

Snail Language Support also provides basic autocomplete for common code structures, such as if statements, while loops, and variable definitions. To utilize this function, type a snippet 'trigger' (listed below) in a snail file, and press `tab` to select the appropriate autocomplete.

For a more detailed description of intended outputs, see `snippets/snippets.json`

| Trigger | Content |
| :-- | :-- |
| `if` | if-else conditional |
| `while` | while loop |
| `class` | standard class definition |
| `class-inherits` | class that inherits from superclass definition |
| `class M` | `Main` class with `main()` method |
| `class m` | `Main` class with `main()` method |
| `main` | `Main` class with `main()` method |
| `Main` | `Main` class with `main()` method |
| `main-inherits` | `Main` class inheriting from superclass with `main()` method |
| `Main-inherits` | `Main` class inheriting from superclass with `main()` method |
| `method-def` | standard method definition |
| `let` | standard variable declaration |
| `let-def` | standard variable declaration and assignment |

---

## Installation

Currently, Snail Language Support is not available on the online VS Code extension marketplace. To install, please follow the instructions below.

1. ensure that the `code` command is installed and usable on your machine. 

```bash
code -v
```

If this command gives you an error, visit the following pages to install the `code` onto your path. Note that exact steps will vary from machine to machine, so the following pages are meant to be a starting point.
- [macOS VS Code setup instructions](https://code.visualstudio.com/docs/setup/mac#_launching-from-the-command-line)
- [Windows VS Code setup instructions](https://code.visualstudio.com/docs/setup/windows#:~:text=Tip%3A%20Setup%20will%20add%20Visual%20Studio%20Code%20to%20your%20%25PATH%25%2C%20so%20from%20the%20console%20you%20can%20type%20%27code%20.%27%20to%20open%20VS%20Code%20on%20that%20folder.%20You%20will%20need%20to%20restart%20your%20console%20after%20the%20installation%20for%20the%20change%20to%20the%20%25PATH%25%20environmental%20variable%20to%20take%20effect.)
- [Linux VS Code setup instructions](https://code.visualstudio.com/docs/setup/linux)

2. Navigate to a directory where you like to keep miscellaneous download files and run the following commands.

```bash
# download vsix file
curl -Ok https://raw.githubusercontent.com/snail-language/snail-language-support/main/snail-language-support-1.0.0.vsix

# install the extension from .vsix file
code --install-extension snail-language-support-1.0.0.vsix
```

Note: if you'd rather, you can also choose to download the raw `.vsix` through the GitHub UI on our [Snail Language Support GitHub page](https://github.com/snail-language/snail-language-support/blob/main/snail-language-support-1.0.0.vsix)

Note: the `code --install-extension` command will handle placing relevant extension files in the right location for use inside of VS Code. We must just ensure that we run the `code --install-extension` command in a location that we have access to our `.vsix` file.

---

## Requirements

Snail Language Support requires an installation of snail of version 1.3.0 or greater. To check your version of snail, run the following command

```bash
# Check for snail version >1.3.0
snail -v 
```

If a snail interpreter is not found, or it has version <1.3.0, see installation instructions [here](https://snail-language.github.io/downloads).

---

## Extension Settings

There are a few notable settings provided in this extension that are worth configuring prior to using this extension. 

* `snailLanguageServer.snailPath`: Absolute path to snail executable to use for Language Server. This is required for static error checking.
* `snailLanguageServer.maxNumberOfProblems`: The maxmimum number of problems our language server is allowed to produce when looking at a single file. In practice, Snail Language Support's current implementation of a language server is unable to produce more than one problem.
* `snailLanguageServer.trace.server`: Traces the communication between VS Code and the language server. Primarily for debugging purposes. `off`, `message`, or `verbose`

---

## Issues

If you encounter an issue with the Snail Langauge Support extension (bug, feature request, or other), please open an issue on our [GitHub Repository](https://github.com/snail-language/snail-language-support/issues). 

### Known Issues

There are a few known issues/bugs that you may encounter that are under plans for future work. 

* When changing the `snailLanguageServer.snailPath` setting, you must [developer reload](https://stackoverflow.com/questions/42002852/how-to-restart-vscode-after-editing-extensions-config#:~:text=Execute%20the%20workbench,reloadWindow%22%2C%0A%20%20%20%20%22when%22%3A%20%22editorTextFocus%22%0A%20%20%7D%0A%5D) your VS Code window in order to allow the language server to restart and the change to take effect. 

---

## Development

There are a number of things that are helpful to know when starting development on this extension. They are noted below.

### Testing locally

### Packaging Extension for distribution

As Snail Language Support is not available on the VS Code extension marketplace, we release a new downoadable packaged extension `.vsix` file with each change. We use the [Visual Studio Code Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#vsce) command line tool `vsce` to do this. To generate this packaged extension, follow the instructions below.

NOTE: the online `vsce` documentation includes directions to publish the extension to the online marketplace. Be sure to read online documentation carefully to avoid publishing to the online marketplace.

```bash
# Ensure that you have the vsce tool installed
npm install -g @vscode/vsce

# Navigate to the snail-language-support directory
cd path/to/snail-language-support

# package the extension src files
vsce package
```

This should generate a `snail-language-support-1.x.x.vsix` file. Include this file when you push any changes to the Snail Language Support repository.

---

## Release Notes

### 1.0.0

Initial release of Snail Language Support