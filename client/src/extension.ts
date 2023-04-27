import * as cp from 'node:child_process';
import * as f from 'node:fs';
import * as lc from 'vscode-languageclient/node';
import * as path from 'path';
import * as v from 'vscode';


let client: lc.LanguageClient;

let snailTerminal : v.Terminal;
let RUN_SNAIL_FILE_CMD = 'snail-language-support.runSnailFile';
let DEBUG_SNAIL_FILE_CMD = 'snail-language-support.debugSnailFile';
let OPEN_SETTINGS_ACTION = 'Open settings';
let OPEN_SETTINGS_CMD = 'workbench.action.openSettings';

export function activate(context: v.ExtensionContext) {

	let snailPath : string = v.workspace.getConfiguration('snailLanguageServer').snailPath;
	let resp = validateSnailPath(snailPath);
	if (resp.status == "ERROR") {

		const errorMessage = v.window.showErrorMessage(resp.message, OPEN_SETTINGS_ACTION);
		errorMessage.then(choice => {
			if (choice === OPEN_SETTINGS_ACTION) {
				v.commands.executeCommand(
					OPEN_SETTINGS_CMD, 
					'snailLanguageServer.snailPath');
			}
		})
		return;
	}

	context.subscriptions.push(v.commands.registerCommand(RUN_SNAIL_FILE_CMD, runSnailFile));
	context.subscriptions.push(v.commands.registerCommand(DEBUG_SNAIL_FILE_CMD, debugSnailFile));

	// The server is implemented in node
	const serverModule = context.asAbsolutePath(
		path.join('client', 'out', 'server.js')
	);
	// The debug options for the server
	// --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
	const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	const serverOptions: lc.ServerOptions = {
		run: { module: serverModule, transport: lc.TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: lc.TransportKind.ipc,
			options: debugOptions
		}
	};

	// Options to control the language client
	const clientOptions: lc.LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [{ scheme: 'file', language: 'snail' }],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: v.workspace.createFileSystemWatcher('**/.clientrc')
		}
	};

	// Create the language client and start the client.
	client = new lc.LanguageClient(
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
		f.accessSync(path, f.constants.F_OK);
	} catch (err) {
		let message : string = "File path to snail doesn't exist: " + path;
		return {
			status: error_code,
			message: message,
			body: err
		}
	}

	try {
		f.accessSync(path, f.constants.X_OK);
	} catch (err) {
		let message = "User does not have execute privelege on snail path: " + path;
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
		snailTerminal = v.window.createTerminal("Snail");
	}
	snailTerminal.show();

	const filePath : String | undefined = v.window.activeTextEditor?.document.fileName;
	let snailPath : String = v.workspace.getConfiguration('snailLanguageServer').snailPath;

	snailTerminal.sendText(snailPath + ' ' + filePath)
}

function debugSnailFile(resource : v.Uri) {
	
	if (!resource && v.window.activeTextEditor) {
		resource = v.window.activeTextEditor.document.uri;
	}

	let config : v.DebugConfiguration = {
		name: "Launch Snail Debug",
		request: "launch",
		type: "snail",
		program: resource.fsPath
	};

	// this line calls 'node client/out/debugAdapter.js'
	v.debug.startDebugging(undefined, config);	
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}

