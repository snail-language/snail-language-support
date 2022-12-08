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

## 11/08/2022

Working on creating a tmp file to run the program. Works well, using [NodeJS writeFile](https://nodejs.org/api/fs.html#fspromiseswritefilefile-data-options) and [NodeJS rmPath](https://nodejs.org/api/fs.html#fspromisesrmpath-options). Ran into some funky stuff where we needed to strip the newlines from the text file to run in snail (because snail doesn't recognize `\n` as one character, only `\` and `n` as separate characters). Thus, the location of the error is messed up because we can't calculate the newline positions and output the red squiggly in the right place. 

Which is actually a problem, because we need to not modify the file when we run it in order to give a valid location. Ok but we can change the way we were erasing newlines to just replace `\n` with `\\n` kind of. Next step is to create a tmp directory so that we are risking less messing with user files. 

Got a working version that creates temp directory, temp file, and then deletes both after executing and pushing diagnostic information. Here is the relevant code lines
```
	const dir: string = mkdtempSync('tmp-');
	const filename: string = dir + '/tmp.sl';
	writeFileSync(filename, text);
    ...
	rmSync(dir, { recursive: true, force: true });
```

Makes solid use of NodeJS [syncronous API](https://nodejs.org/api/fs.html) as noted on the docs api. 
- [spawnSync](https://nodejs.org/api/child_process.html#child_processspawnsynccommand-args-options)

## 11/08/2022

Now, working on modifying snail. `something^` is a reference which is cool. Basically, we set some references at the beginning of the file as our "options" or "flags", set them to true as we process our command line arguments. Then, as we run our input file, we check against those reference values and change how we run our program snail input file accordingly. Pretty slick. 

TODO do we need to address --server flag and giving an sl-ast or sl-lex file? I lean towards no.

## 11/09/2022

Some crazy stuff. Working on getting references to be accessible in `parser.mly` and `lexer.re`, essentially by putting them into another file and opening it as a module, then switching on it whenever we get a lex or parse error to decide which sort of output we want. so wild. We can dereference a thing in ocaml with the `!` operator [help blog](https://www.cs.cornell.edu/courses/cs3110/2012sp/recitations/rec10.html)

Getting some weird errors. Able to get lexer and parser to output server information when they encounter error, but I am having trouble getting a valid offset value specifically when I get parser errors that call our where function defined in parser.mly. Not sure what is causing it, but I am finding that `loc.pos_cnum` is just the column, and that `loc.pos_bol` is just zero. I THINK it has to do with how we define our lexing positions in token.re in line 119 to 128, because we set a `Lexing.pos_bol: 0`, but playing around with that doesn't get me anywhere yet. We can get the location from our `parser.mly` file that gives a correct offset value (off by one from the column), but we are throwing that value away in lieu of our `where` function. Maybe we use the location from that "switch" for the errors (because it gives us an offset value (that may or may not be off by one)) to use for the --server flag, and the non-server call can keep using the `where` function to get the line and column numbers. Here are the docs I was combing through

- [ReasonML Docs](https://reasonml.github.io/docs/en/overview)
- [ReasonML Libraries](https://reasonml.github.io/api/)
- [SedLex (which eventually leads to Lexing.Position)](https://ocaml.org/p/sedlex/2.6/doc/Sedlexing/Utf8/index.html)


Plan from here:
- probably make the call on having the (l, val) way of getting a location for a single error, and seeing if we can use that snail --server call to get a good offset value for that error. 
- Will also have to look into getting the end position

## 11/10/2022

What did I work on this morning? I was trying to get the language server to call my current esy x snail project, but spawnSync is kind of not having it. Main issue I am running into is how to get the child process to navigate to the esy project, compile the esy x snail project, and then call it on a file **back in the directory the language server is running**. I might be able to spawn a blank sync process, and then manually execute the commands to navigate and build projects and run files etc. Once we are sure that we can get the server error output from our current `esy x snail` version, we can see if the offset values look good enough to implement the rest of the error types. 

I have learned that ENOENT errors likely have to do with pathing issues, and if the child returns with a status of 127, it likely encountered an invalid command. The stdout and stderr come back in buffers that we can convert to strings. 

## 11/11/2022

Met with Kevin. What did I learn?
1. esy x snail BUILDS a snail executable, that I can call if I navigate and find the right path for it inside the `_esy` directory
2. YoJson can build me a json string if I feed it an object (we did this in PL)
3. we set the `pos.bol` value to `0` in the `lexer_loc` section of defining our lexer in `snail.re` (lines ~98-105)

TODO
1. Modify manual JSON building to YoJson building to let YoJson handle dumping to string
2. check that the offset value provided matches where we want it to (by testing in LSP call)
3. Modify JSON output to include
    - token ending position
        - It's in the lexer somewhere, but we currently throw it away. We'll have to modify `loc` in `util` to include a `offset_end` value (likely)
    - status (OK or ERROR)
4. Add a setting field to the extension to allow us to provide a path for snail (when calling snail in LSP)
    - if it is empty, just run snail
    - if it is not empty, run our specified path

## 11/12/2022

Today, worked on getting yojson to build json object. Was struggling, and then remembered that Yojson objects are essentially ``Assoc()` and you need the ` mark in order to access the constructor. 

## 11/15/2022

Today, plan is to work on getting Yojson to handle json values and check the offset value that we are giving lsp. Both are rock solid. When we call with the --server flag, we always exit before evaluating the program with a response of this format:

{"status":"OK","type":"None","message":"No Lexer or Parser errors","location":{"offset_start":0,"offset_end":1,"line":0,"col":0}}

That way we can parse the response as JSON and not crash our language server.

Now, trying to feed offset_end values from lexer and parser. We can pretty easily get offset_end values from our lexer. Lexing.positions returns both a start position and end position, so we need to save the end position and assign it a value in our Util.location value (which requires some rejiggering of Util.location and the corresponding places it is called). Shit works.

Now, trying to add a setting to the extension to let a user put a path to their specified version of snail. Did it through the [contributes.configuration endpoint](https://code.visualstudio.com/api/references/contribution-points#contributes.configuration). Just worked.

Found an SYE project by Vela Dimitrova Mineva, advised by Dr. Lisa Torrey: "Refactoring the ReflectionApp Java Applet" that seems to be a good computer science Software Development focused SYE that I can read through just to help give myself a mental model of what my final paper might look like for a project like snail language support. Got an electronic copy from Dr. Torrey. 

## 11/16/2022

Our Language Server is in a good spot right now. There certainly are additional features we could consider adding, and potentially will go through effort to add, but right now I want to shift gears to start actually looking at a debugger. 

Some debuggers are implemented and stored in a separate extension package or project, but I think it is possible to put them into the same package/project/repository (like in this [C/C++ example](https://github.com/microsoft/vscode-cpptools/blob/main/Extension/README.md))

## 11/17/2022

Met with Kevin. Language Server is looking good. Moving to Debugger. We will need to find a way to keep track of breakpoints (as in which lines have breakpoints). Then, when we are evaluating expressions, if a given expression has a breakpoint, we will call a separate function to support debugging functions (like printing out variable values), and when we want to continue running our program, we return from the function and continue evaluating our expressions in the program. 

TODO
1. Compile the functions/things that snail needs to be able to do/keep track of in order to work with VSCode DAP
2. add files and directories to have a "debugger" in our extension
    - Just like the contributes endpoints and stuff, enough to have a debug window start up (but not actually do anything)
3. Read Vela Dimitrova Mineva SYE project
    - Start outlining how my SYE paper might look organizationally

## 11/29/2022

Today, going to try to figure out what snail needs to be able to do in order to work with VSCode DAP. ie what functionality must it support.
1. Keeping track of breakpoints (line number in source, line position in source (multiple per line), when a particular function is called, when a particular condition evaluates to true)
2. Keeping track of logpoints 
3. Be able to keep track of stepping forward, stepping into, stopping and resuming execution
4. Keep track of stack and call traces
5. Report environment and store variables and values (as primitives and complex structures)
6. keep track of watch expressions (expressions to execute whenever the debugger pauses)

## 12/01/2022

Today, going to try to dig deeper into VSCode DAP docs to figure out what techy stuff snail needs to support. I.e. get more familiar with the API and what functions need to be implemented
- [DAP specifications](https://microsoft.github.io/debug-adapter-protocol/specification)
1. keep track of breakpoint locations (source locations, function names, exceptions/errors (maybe))
- [DAP breakpoints docs](https://microsoft.github.io/debug-adapter-protocol/specification#Requests_SetBreakpoints)
1a. Stop at said breakpoint, based on source code line number, not ast location
2. return method/scope identifiers/names, line numbers and column numbers for beginning(required) and end(optional) of said scope (often methods or objects probably)
- for Stack frames and threads for stack traces
- [DAP threads](https://microsoft.github.io/debug-adapter-protocol/specification#Types_Thread)
- [DAP stack frames](https://microsoft.github.io/debug-adapter-protocol/specification#Types_StackFrame)
- [DAP next](https://microsoft.github.io/debug-adapter-protocol/specification#Requests_Next)
- [DAP pause](https://microsoft.github.io/debug-adapter-protocol/specification#Requests_Pause)
- [DAP continue](https://microsoft.github.io/debug-adapter-protocol/specification#Requests_Continue)
- [DAP step in](https://microsoft.github.io/debug-adapter-protocol/specification#Requests_StepIn)
- [DAP step out](https://microsoft.github.io/debug-adapter-protocol/specification#Requests_StepOut)
3. Memory locations (likely already tracked in environment or store)
- [DAP memory events](https://microsoft.github.io/debug-adapter-protocol/specification)
4. Ability to execute single expressions not a part of an entire program
- [DAP evaluate expression request](https://microsoft.github.io/debug-adapter-protocol/specification#Requests_Evaluate)
5. Modify environment and store mid execution while in debug mode?
- [DAP set expression request](https://microsoft.github.io/debug-adapter-protocol/specification#Requests_SetExpression)
6. Keep track of step in, step out when continuing execution
- [DAP StepInTargets request](https://microsoft.github.io/debug-adapter-protocol/specification#Requests_StepInTargets)
7. Side effect free expression evaluation (for hovering capabilities)
8. Keep filepath to source code

shortened list:
1. breakpoints
2. call stack
3. contents of environment and store

## 12/06/22

Trying to mesh mock debugger and language server package to be able to run mock debug (markdown) files when opening our LSP for snail extension. Not much luck yet. Been trying to modify package.json and launch.json files. Might need to look at extensions.json, settings.json, tasks.json, or some other configuration files

This document talks about what launch and attach configurations actually do, and may help clear some confusion about what actually happens when I try to launch my extension (and what isn't happening)
- https://code.visualstudio.com/docs/editor/debugging#_launch-configurations

## 12/08/22

Starting to understand what I need to do. In the `package.json` of the extension package (as a whole), we have a `main` attribute. This specifies a path to a generated `extension.js` file, which is the code that our extension runs. So, how I have my code organized right now, I need to insert the debugger code (from `debug/src/` into the `client/src/` code), to give VSCode a single extension file to run. 




