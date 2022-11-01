The following document is a provisionary/preliminary schedule for cprein19's SYE honors project. It will outline the goals and intermediate steps to accomplish those goals.

## Goals

1. Implement syntax highlighting for snail in VSCode.

2. Add auto-complete support for snail in VSCode.

3. Implement and release an IDE style debugger for Snail as an exentsion in VSCode.
    a. Fall Debugger Goal: Implement breakpoint support
    b. Spring Debugger Goal: Add support for step into, step through, read values.

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

    - Investigate [this](https://github.com/snail-language/snail-language.github.io/issues/1) issue
- Learn about syntax highlighting in VSCode
   - [VSCode Syntax Highlighting Docs](https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide)
   - [VSCode Language support blog](https://www.codemag.com/article/1809051/Writing-Your-Own-Debugger-and-Language-Extensions-with-Visual-Studio-Code)
- Implement syntax highlighting for snail in VSCode
   - [Writing a TextMate Grammar](https://www.apeth.com/nonblog/stories/textmatebundle.html)
   - [Yo Code tutorial](https://www.youtube.com/watch?v=5msZv-nKebI)
   - [Trials of building syntax highlighting blog](https://dev.to/alexantra/i-built-my-own-vs-code-syntax-highlighter-from-scratch-and-here-s-what-i-learned-1h98)
   - [SNAIL BNF docs](https://snail-language.github.io/docs/syntax)
   - [FSharp TextMate Grammar](http://hoomla.se/TextmateFSharpGrammar.html)
   - [TextMate Regex Specs](https://macromates.com/manual/en/regular_expressions)
   - [Testing TextMate Regex](https://rubular.com/)
   - [TextMate Grammar Docs](https://macromates.com/manual/en/language_grammars)
   - [Ruby Style Regex Syntax](https://macromates.com/manual/en/regular_expressions#syntax_oniguruma)

October
- Learn about auto-complete support in VSCode
    - [VSCode Language Configuration Docs](https://code.visualstudio.com/api/language-extensions/language-configuration-guide)
    - [VSCode snippets](https://code.visualstudio.com/docs/editor/userdefinedsnippets)
    - [VSCode snippets in extensions](https://code.visualstudio.com/api/language-extensions/snippet-guide#using-textmate-snippets)
    - [Some Example Java Snippets in VSCode](https://github.com/redhat-developer/vscode-java/tree/master/snippets)
- Implement Language configuration in VSCode
    - [Java lang support extension (by RedHat) repo](https://github.com/redhat-developer/vscode-java)


November
- Implement Language Server Protocol
    - [LSP docs](https://code.visualstudio.com/api/language-extensions/language-server-extension-guide#implementing-a-language-server)
    - [COOL LSP repo](https://github.com/dynaroars/COOL-Language-Support)
    - [Intro to LSP blog](https://www.alibabacloud.com/blog/quick-start-to-vscode-plug-ins-language-server-protocol-lsp_595294?spm=a2c41.13494494.0.0)
- Start our DEBUGGER!
    - Play around with [Mock Debugger](https://code.visualstudio.com/api/extension-guides/debugger-extension#the-mock-debug-extension) to see what we're shooting for 
    - [VSCode Language support blog](https://www.codemag.com/article/1809051/Writing-Your-Own-Debugger-and-Language-Extensions-with-Visual-Studio-Code)
    - [C/C++ Debugger Source Code](https://github.com/microsoft/vscode-cpptools/tree/main/Extension/src)

December

**December 16th** Last day of Fall Classes

January

**January 18th** First day of Spring Classes

February
- Link debugger to VSCode
    - [Hello world VSCode Extension Guide](https://code.visualstudio.com/api/get-started/your-first-extension)
    - [VSCode Debugger Extension Guide](https://code.visualstudio.com/api/extension-guides/debugger-extension)

March

April

**April 15th** Feature Lock-In
- Publish debugger extension
    - [Publishing extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

**April 28th** Festival of Sciences Poster Presentation
- Must have functional, finalized, and released debugger at this point

**May 12th** Last day of Finals Week
- Must have honors paper completed
