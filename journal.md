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