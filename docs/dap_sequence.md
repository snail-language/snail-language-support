# Sequence Diagrams

These are some diagrams that highlight how a user, VSCode, and Snail all interact with eachother.

## Top Level

In this diagram, we model how a user interacts with VSCode and how VSCode interacts with Snail to offer debugging capabilities to the user.

```mermaid
sequenceDiagram
    actor User
    participant VSCode 
    participant Snail

    User -->> VSCode: User developes code, sets breakpoints, etc.
    User ->> VSCode: User starts debugging
    activate VSCode

    VSCode ->> + Snail: Initialize Request
    Snail ->> VSCode: Initialize Response (capabilities)
    Snail ->> - VSCode: Initialized Event

    activate VSCode

    VSCode ->> + Snail: SetBreakpoints Request
    Snail ->> - VSCode: Breakpoints Response

    VSCode ->> + Snail: Configuration Done Request
    Snail ->> - VSCode: Configuration Done Response

    deactivate VSCode
    
    VSCode ->> + Snail: Launch Request
    activate Snail
    Snail ->> - VSCode: Launch Response (empty body) 

    VSCode ->> User: VSCode displays a debugging session with debugging tools 
    %% TODO make the bottom part sort of trail off here

    deactivate Snail
    deactivate VSCode
```

# Inside our extension

This diagaram highlights some inner interactions with our extension and snail program.

```mermaid
sequenceDiagram
    participant V as VSCode
    participant SLPDA as Snail-Language-Support DebugAdapter
    participant SDA as Snail DebugAdapter
    participant S as Snail Interpreter

    activate V

    V -->> + SLPDA: launch Debug Adapter

    V ->> SLPDA: Initialize Request
    SLPDA ->> + SDA: Initialize Request
    SDA ->> + S: Initialize Request
    S ->> SDA: Initialize Response (capabilities)
    SDA ->> SLPDA: Initialize Response (capabilities)
    SLPDA ->> V: Initialize Response (capabilities)

    S ->> SDA: Initialized Event
    SDA ->> SLPDA: Initialized Event
    SLPDA ->> V: Initialized Event

    V ->> SLPDA: SetBreakpoints Request
    SLPDA ->> SDA: SetBreakpoints Request
    SDA ->> S: SetBreakpoints Request
    S ->> SDA: Breakpoints Response
    SDA ->> SLPDA: Breakpoints Response
    SLPDA ->> V: Breakpoints Response

    V ->> SLPDA: Configuration Done Request
    SLPDA ->> SDA: Configuration Done Request
    SDA ->> S: Configuration Done Request
    S ->> SDA: Configuration Done Response
    SDA ->> SLPDA: Configuration Done Response
    SLPDA ->> V: Configuration Done Response

    V ->> SLPDA: Launch Request
    SLPDA ->> SDA: Launch Request
    SDA ->> S: Launch Request
    S ->> SDA: Launch Response
    SDA ->> SLPDA: Launch Response
    SLPDA ->> V: Launch Response

    deactivate S
    deactivate SLPDA
    deactivate SDA
    deactivate V
    % TODO trail this off
```

# Overall

this diagram highlights an end-to-end interaction overview

```mermaid
sequenceDiagram
    actor U as User
    participant V as VSCode UI
    participant SLPDA as Snail-Language-Support DebugAdapter
    participant SDA as Snail  DebugAdapter
    participant S as Snail Interpreter

    U ->> V: Develop code, set breakpoints, etc.
    V ->> SLPDA: send requests for information
    SLPDA ->> SDA: echo requests to snail debug adapter
    SDA ->> S: run snail accordingly
```