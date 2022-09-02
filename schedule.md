The following document is a provisionary/preliminary schedule for cprein19's SYE honors project. It will outline the goals and intermediate steps to accomplish those goals.

## Goals

1. Implement syntax highlighting for snail in VSCode.

2. Add auto-complete support for snail in VSCode.

3. Implement and release an IDE style debugger for Snail as an exentsion in VSCode.

## Learning Goals

- Gain familiarity with VS Code language servers
- Deliver a product to a public audience.
- Improve documentation writing skills and prioritize docs throughout project.
- Practice problem solving skills by troubleshooting issues on my own.
- Be accountable to a plan enforced only by myself.

## Schedule

September
- Address a few known snail issues. Get my feet wet again.
    - [Identifier _ enhancement](https://github.com/snail-language/snail/issues/7) (Lexer)
    - [EOF messages](https://github.com/snail-language/snail/issues/13) (Parser)
    - [Array Access store issue](https://github.com/snail-language/snail/issues/31) (Interpreter)

    - is [this](https://github.com/snail-language/snail-language.github.io/issues/1) error still existing?
- Learn about syntax highlighting in VSCode
   - [VSCode Syntax Highlighting Docs](https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide)
   - [VSCode Language support blog](https://www.codemag.com/article/1809051/Writing-Your-Own-Debugger-and-Language-Extensions-with-Visual-Studio-Code)
- Implement syntax highlighting for snail in VSCode

October
- Learn about auto-complete support in VSCode
    - [VSCode Language Configuration Docs](https://code.visualstudio.com/api/language-extensions/language-configuration-guide)
    - [VSCode Language support blog](https://www.codemag.com/article/1809051/Writing-Your-Own-Debugger-and-Language-Extensions-with-Visual-Studio-Code)
- Implement Language configuration in VSCode
- Start our DEBUGGER!
    - Play around with [Mock Debugger](https://code.visualstudio.com/api/extension-guides/debugger-extension#the-mock-debug-extension) to see what we're shooting for 
    - [VSCode Language support blog](https://www.codemag.com/article/1809051/Writing-Your-Own-Debugger-and-Language-Extensions-with-Visual-Studio-Code)

From what I am reading, a VSCode debugging extension is an intermediary between a standalone debugger and the vscode debug extension api. Will I be creating a gdb style debugger first, then linking it to vscode? If so, how do I ensure that it supports debugging on mac, windows, etc., not just my mac machine?

November

December

**December 16th** Last day of Classes

January

**January 18th** First day of Classes

February
- Link debugger to VSCode
    - [Hello world VSCode Extension Guide](https://code.visualstudio.com/api/get-started/your-first-extension)
    - [VSCode Debugger Extension Guide](https://code.visualstudio.com/api/extension-guides/debugger-extension)

March

April
- Publish debugger extension
    - [Publishing extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

**April 28th** Festival of Sciences Poster Presentation
- Must have functional, finalized, and released debugger at this point

**May 12th** Last day of Finals Week
- Must have honors paper completed