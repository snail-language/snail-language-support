import * as path from 'path';
import { workspace, commands, window, debug,
	ExtensionContext, Terminal, ConfigurationScope, DebugConfiguration} from 'vscode';

import * as vscode from 'vscode';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind,
} from 'vscode-languageclient/node';

import * as fs from 'node:fs';
import * as cp from 'node:child_process';

let client: LanguageClient;

let snailTerminal : Terminal;
let RUN_SNAIL_FILE_CMD = 'snail-language-support.runSnailFile';
let DEBUG_SNAIL_FILE_CMD = 'snail-language-support.debugSnailFile';

export function activate(context: ExtensionContext) {

	let snailPath : string = vscode.workspace.getConfiguration('snailLanguageServer').snailPath;
	let resp = validateSnailPath(snailPath);
	if (resp.status == "ERROR") {
		// TODO add a link to settings
		vscode.window.showErrorMessage(resp.message);
		return;
	}

	context.subscriptions.push(commands.registerCommand(RUN_SNAIL_FILE_CMD, runSnailFile));
	context.subscriptions.push(commands.registerCommand(DEBUG_SNAIL_FILE_CMD, debugSnailFile));

	// The server is implemented in node
	const serverModule = context.asAbsolutePath(
		path.join('client', 'out', 'server.js')
	);
	// The debug options for the server
	// --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
	const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: debugOptions
		}
	};

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [{ scheme: 'file', language: 'snail' }],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		}
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		'snailLanguageServer',
		'Language Server for Snail',
		serverOptions,
		clientOptions
	);

	// Start the client. This will also launch the server
	client.start();
}

function validateSnailPath(path : string) {
	let error_code : string = "ERROR";
	let success_code : string = "OK";
	try {
		fs.accessSync(path, fs.constants.F_OK);
	} catch (err) {
		let message : string = "file path to snail doesn't exist: " + path;
		return {
			status: error_code,
			message: message,
			body: err
		}
	}

	try {
		fs.accessSync(path, fs.constants.X_OK);
	} catch (err) {
		let message = "user does not have execute privelege on snail path: " + path;
		return {
			status: error_code,
			message: message,
			body: err
		}
	}

	const snailCapabilities = cp.spawnSync(path, ['-h'])
		.stdout.toString()
		.split("\n")
		.map((item, _idx, _arr) => {
			return item.trim().split(' ')[0];
		});

	if (!snailCapabilities.includes('-s')) {
		let message : string = "This version of snail does not support language server capabilities: " + path;
		return {
			status: error_code,
			message: message,
			body: null
		}
	}

	let message : string = "yay";
	return {
		status: success_code,
		message: message,
		body: null
	}	
}

function runSnailFile() {
	if (snailTerminal === undefined) {
		snailTerminal = window.createTerminal("Snail");
	}
	snailTerminal.show();

	const filePath : String | undefined = window.activeTextEditor?.document.fileName;
	// TODO deal with scope?
	let scope : ConfigurationScope;
	let snailPath : String = workspace.getConfiguration('snailLanguageServer').snailPath;

	snailTerminal.sendText(snailPath + ' ' + filePath)
}

function debugSnailFile(resource : vscode.Uri) {
	
	if (!resource && vscode.window.activeTextEditor) {
		resource = vscode.window.activeTextEditor.document.uri;
	}

	let config : DebugConfiguration = {
		name: "Launch Snail Debug",
		request: "launch",
		type: "snail",
		program: resource.fsPath
	};

	// this line ends up calling 'node client/out/debugAdapter.js'
	// so I think we need to find a way to launch snail in 'debug mode' ( instead of our nc -l 9999 ) here
	// 		or right when we launch debugAdapter.js
	debug.startDebugging(undefined, config);	
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}

