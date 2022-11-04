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

## 11/03/2022

pLan today is to try and get an LSP doing some rudimentary stuff in a snail file (just recognizing all caps).

Wow, crazy stuff going on. Learned a couple things so far. Getting a better sense of how language server works: basically it runs server.ts and passes information via json back and forth between vscode client and language server running server.ts (on some handlers that we define in server.ts).

We can call snail and get the response of the call like so 

```
const child = spawnSync( 'snail', [text] );
const err_msg = child.stdout.toString();
```

However, `spawnSync` passes `[text]` as stdin, and snail only reads from files. Going to try to find a way to take the current file name from a language server.

Able to get the filename, the `textDocument` object gives a uri (like, extended filepath), and we can split it to get just the filename and run that file with the reference snail interpreter. Naturally, the first issue we run into is that it is running the file, which is not always up to date with the text *in* the file. For now, I am going to try to, for lack of better words, place the squiggly line in the right place.

A Snail error message looks like `ERROR: 10:13: Parser: unexpected token i`. Check out this snippet of COOL extension code

```
const err_line		= parseInt(err_msg.substring(7)) - 1;	// convert to 0-based indexing
const pattern 	 	= /\n/g;
const newline_locs  = Array.from(("\n"+text+"\n").matchAll(pattern), x=>x.index);
const err_start		= Number(newline_locs[err_line]) + 1;
const err_end		= Number(newline_locs[err_line + 1]);
```

The idea here is to get the raw indices of the newlines, so that we can give the LSP `textDocument.positionAt(THIS)` a proper integer to convert to a position in a document, to then tell LSP where to START and STOP our error message. Based on how snail error messages work, we will likely be just highlighting one character (because snail only collects a single location (line, col) for an error location). 

## 11/04/2022

Some Number() wrapping to deal with undefineds of arrays and numbers. I would like to look up some typescript type rules to understand how that works for us. Currently getting the error to land a few lines too far down, I believe it is because the MatchAll(RegExp) is matching the newline characters within strings in the snail program, which do not represent new lines in the program (just the stdout which we don't care about when finding the location of the error in the snail file)

### Meeting with Kevin

1. Move towards creating a tempfile (instead of running existing file)
2. modify snail and give it a --server flag
	- potentially having snail return character offset for error (not line and col) and an end-of-lexeme character offset?
	- having snail run "files" from stdin as just text (more distant)

How are we going to modify snail to give us better info?
1. modify `snail.re` to have a `--server -s` option to return useful LSP information
    - IE char offset start, char offset end
    - give it a different lex and parse error generating function to pass that information
    - [Sedlex Docs](https://ocaml.org/p/ocaml-base-compiler/4.14.0/doc/Stdlib/Lexing/index.html#type-position)
