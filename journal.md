## 10/18/2022

Began working on language configurations. built in `language-configurations.json` file gives comment, autoclosing, autosurrounding. Tried to address folding. The default is to fold based on indentation. I tried to make it by brackets, and was able to make it "work", except it doesn't nest properly. It closes with the first matching end bracket. Probably going to stick to folding on indentation for now and continue the language configuration journey.

## 10/20/2022

Today, planning on trying to "fix" syntax highlighting to still highlight on poorly formed snail programs. 

Really, just took the time to un-nest and make my syntax highlighting less strict. Interesting to work with "order of operations" with how soon the grammar matches each type. Any endpoints (like enclosed in brackets, parens, etc) end up looping back to "$self", which references the whole grammar. This way, any malformed enclosures don't mess up the highlighting in the rest of the document.

Now, for case insensitivity. Ruby-style regex is crazy! (Oniguruma syntax)[https://macromates.com/manual/en/regular_expressions#syntax_oniguruma] Allows some really cool stuff, like `(?i)` options at the beginning of a regex string to treat it case insensitively. There are a few other options. 

Not really sure where we are left at with this syntax highlighting. Might want to peruse the example snail programs to see how the highlighting is working in a variety of situations. 

## 10/21/2022

Met with Kevin. Plan going forward is to
1. Finish language configuration file 
    - going through documentation
    - looking at an example language configuration of java or C
        - autocomplete for (;, if,else,while blocks (high priority), method or class defs (low priority))
2. Research semantic highlighting
    - what actually is it, what can it do for us
3. Research language server protocol
    - how can we begin implementing it

## 10/25/2022

Plan for today is to work through language config documentation and looking at an example config file

wtf is autocomplete you may ask? [Snippets!](https://code.visualstudio.com/api/language-extensions/snippet-guide#using-textmate-snippets) Are the way you can provide autocomplete support both privately for your own vscode ventures and extension ventures. They are separate from a language config file, but get added to your extension through the [contributes](https://code.visualstudio.com/api/references/contribution-points) endpoint, which is where MOST if not all useful vscode extension capabilities are added. 

You basically give a string that matches a "shortcut" that you want to use, and then an array of lines that you want to insert when you type the shortcut. I've got it in `snippets/snippets.json`. 

In testing out the snippets I found a small bug in syntax highlighting. Syntax highlighting doesn't highlight classes that don't inherit, like `class Main { ... }` doesn't highlight Main as a class.

## 10/27/2022

Today, want to refine the method snippet (maybe get it to match regex) and and look at previous non-inherit syntax highlighting issue. 

Fixed small non-inherit issue, just a small regex fix (allow 0 or more whitespace in some spots).

grumble, if-else highlighting is not working inside of classes and methods (not anymore, just fixed)

OK, so findings for today include:
- autocomplete for ';' is a lot harder than it seems: lots of separate extensions exist in vscode to offer that capability
- snippets don't match regex (which makes method def and method call autocomplete kinda super difficult)
- semantic highlighting has nothing to do with underlining
    - and also doesn't make sense to me: example semantic highlight providers look like they just work, I don't see how they define grammar parsing for a language

Current development points for the extension
- folding does not work (just goes based on indentation)
- no autocomplete for ';'

## 10/28/2022

Today, met with Kevin. Made a few changes to snippets to incorporate while loops, class inheritance, let. Plan moving forward is to implement a language server to do parsing in order to get static error checking.
- Like, essentially having the language server run snail in the background and see if it gets any parse errors back.
- [LSP docs](https://code.visualstudio.com/api/language-extensions/language-server-extension-guide#implementing-a-language-server)
- [Cool Repo (with LSP implemented)](https://github.com/dynaroars/COOL-Language-Support)

## 11/01/2022

Reading through LSP docs to get a sense of what we are doing. I think it makes sense, we are just implementing behaviors for a lot of VSCode extension/LSP endpoints so that when VSCode calls to use a language server, our extension can respond appropriately. I copied most of the LSP infrastructure from the lsp-sample provided by VSCode. Currently, it underlines words typed in all caps in plain text files. TODO from now is to reconfigure the new stuff to activate some beginner stuff in snail files. 
- beginner stuff being an arbitrary highlighting all uppercase words
- and then add some autocomplete ideas

From here, have to go through LSP docs (linked above) piece by piece and modify my existing code to apply to snail files. 

