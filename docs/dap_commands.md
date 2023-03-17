# Debug_Protocol commands/modules

The following debug_protocol commands defined in `ocaml_dap` are modules that we need to register handlers for. 

The `ocaml_dap` documentation can be found [here](https://hackwaly.github.io/ocaml-dap/dap/index.html).

The debug adapter protocol (defining what `ocaml_dap` implements) has documentation and specifications [here](https://microsoft.github.io/debug-adapter-protocol/specification)

1. Breakpoints
- [Set_breakpoints_command](https://hackwaly.github.io/ocaml-dap/dap/Debug_protocol/index.html#module-Set_breakpoints_command)
- [Breakpoint_locations_command](https://hackwaly.github.io/ocaml-dap/dap/Debug_protocol/index.html#module-Breakpoint_locations_command) (maybe)

2. Stopping/pausing execution
- [Pause_Command](https://hackwaly.github.io/ocaml-dap/dap/Debug_protocol/index.html#module-Pause_command)
    - recieve this request, send a response, and then send a [Stopped_event](https://hackwaly.github.io/ocaml-dap/dap/Debug_protocol/index.html#module-Stopped_event)

3. Continuing/resuming execution
- [Continue_command](https://hackwaly.github.io/ocaml-dap/dap/Debug_protocol/index.html#module-Continue_command)
    - recieve this request, send response, DO NOT need to send a [Continued_event](https://hackwaly.github.io/ocaml-dap/dap/Debug_protocol/index.html#module-Continued_event)

4. Step in/out/forward
- [Next_command](https://hackwaly.github.io/ocaml-dap/dap/Debug_protocol/index.html#module-Next_command)
    - recieve this request, send a response, process the 'step', send a [Stopped_event](https://hackwaly.github.io/ocaml-dap/dap/Debug_protocol/index.html#module-Stopped_event)
- [Step_in_targets_command](https://hackwaly.github.io/ocaml-dap/dap/Debug_protocol/index.html#module-Step_in_targets_command)
    - retrieves possible targets to use in stepIn command (optional I believe)
- [Step_in_command](https://hackwaly.github.io/ocaml-dap/dap/Debug_protocol/index.html#module-Step_in_command)
    - recieve this request, send a response, process the step (with adjusted granularity?), then send a [Stopped_event](https://hackwaly.github.io/ocaml-dap/dap/Debug_protocol/index.html#module-Stopped_event)
- [Step_out_command](https://hackwaly.github.io/ocaml-dap/dap/Debug_protocol/index.html#module-Step_out_command)
    - recieve this request, send a response, process the step, then send a [Stopped_event](https://hackwaly.github.io/ocaml-dap/dap/Debug_protocol/index.html#module-Stopped_event)

5. Call stack
- [Stack_trace_command](https://hackwaly.github.io/ocaml-dap/dap/Debug_protocol/index.html#module-Stack_trace_command)

6. Variable inspection
- [Scopes_command](https://hackwaly.github.io/ocaml-dap/dap/Debug_protocol/index.html#module-Scopes_command)
- [Variables_command](https://hackwaly.github.io/ocaml-dap/dap/Debug_protocol/index.html#module-Variables_command)
- [Evaluate_command](https://hackwaly.github.io/ocaml-dap/dap/Debug_protocol/index.html#module-Evaluate_command)

7. Restart
- [Restart_command](https://hackwaly.github.io/ocaml-dap/dap/Debug_protocol/index.html#module-Restart_command)
    - either support it or emulate it

8. Disconnect/terminate/exit
- [Disconnect_command](https://hackwaly.github.io/ocaml-dap/dap/Debug_protocol/index.html#module-Disconnect_command)
- [Terminate_command](https://hackwaly.github.io/ocaml-dap/dap/Debug_protocol/index.html#module-Terminate_command)
    - [Terminate_event](https://hackwaly.github.io/ocaml-dap/dap/Debug_protocol/index.html#module-Terminated_event) must be related somehow
- [Exited_event](https://hackwaly.github.io/ocaml-dap/dap/Debug_protocol/index.html#module-Exited_event)
    - also probably related somehow

9. Initialization
- [Initialize_command](https://hackwaly.github.io/ocaml-dap/dap/Debug_protocol/index.html#module-Initialize_command)
    - [Initialized_event](https://hackwaly.github.io/ocaml-dap/dap/Debug_protocol/index.html#module-Initialized_event)
- [Configuration_done_command](https://hackwaly.github.io/ocaml-dap/dap/Debug_protocol/index.html#module-Configuration_done_command)
- [Capabilities_event](https://hackwaly.github.io/ocaml-dap/dap/Debug_protocol/index.html#module-Capabilities_event)
    - has to do with capabilities changing (so maybe we will not support it)
- [Launch_command](https://hackwaly.github.io/ocaml-dap/dap/Debug_protocol/index.html#module-Launch_command)
- [Attach_command](https://hackwaly.github.io/ocaml-dap/dap/Debug_protocol/index.html#module-Attach_command)
    - We will probably emulate this by just launching when we respond to an attach command
- [Threads_command](https://hackwaly.github.io/ocaml-dap/dap/Debug_protocol/index.html#module-Threads_command)