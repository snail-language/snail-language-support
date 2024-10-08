import * as cp from 'node:child_process';
import * as f from 'node:fs';
import * as ls from 'vscode-languageserver/node';
import * as os from 'node:os';
import * as path from 'node:path';

import {
	TextDocument
} from 'vscode-languageserver-textdocument';


// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = ls.createConnection(ls.ProposedFeatures.all);

// Create a simple text document manager.
const documents: ls.TextDocuments<TextDocument> = new ls.TextDocuments(TextDocument);

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let hasDiagnosticRelatedInformationCapability = false;

connection.onInitialize((params: ls.InitializeParams) => {
	const capabilities = params.capabilities;

	// Does the client support the `workspace/configuration` request?
	// If not, we fall back using global settings.
	hasConfigurationCapability = !!(
		capabilities.workspace && !!capabilities.workspace.configuration
	);
	hasWorkspaceFolderCapability = !!(
		capabilities.workspace && !!capabilities.workspace.workspaceFolders
	);
	hasDiagnosticRelatedInformationCapability = !!(
		capabilities.textDocument &&
		capabilities.textDocument.publishDiagnostics &&
		capabilities.textDocument.publishDiagnostics.relatedInformation
	);

	const result: ls.InitializeResult = {
		capabilities: {
			textDocumentSync: ls.TextDocumentSyncKind.Incremental,
		}
	};
	if (hasWorkspaceFolderCapability) {
		result.capabilities.workspace = {
			workspaceFolders: {
				supported: true
			}
		};
	}
	return result;
});

connection.onInitialized(() => {
	if (hasConfigurationCapability) {
		// Register for all configuration changes.
		connection.client.register(ls.DidChangeConfigurationNotification.type, undefined);
	}
	if (hasWorkspaceFolderCapability) {
		connection.workspace.onDidChangeWorkspaceFolders(_event => {
			connection.console.log('Workspace folder change event received.');
		});
	}
});

// The example settings
interface ExtensionSettings {
	maxNumberOfProblems: number;
	snailPath: string;
}

// The global settings, used when the `workspace/configuration` request is not supported by the client.
// Please note that this is not the case when using this server with the client provided in this example
// but could happen with other clients.
const defaultSettings: ExtensionSettings = { maxNumberOfProblems: 1000, snailPath: "snail" };
let globalSettings: ExtensionSettings = defaultSettings;

// Cache the settings of all open documents
const documentSettings: Map<string, Thenable<ExtensionSettings>> = new Map();

connection.onDidChangeConfiguration(change => {
	if (hasConfigurationCapability) {
		// Reset all cached document settings
		documentSettings.clear();
	} else {
		globalSettings = <ExtensionSettings>(
			(change.settings.snailLanguageServer || defaultSettings)
		);
	}
	
	// Revalidate all open text documents
	documents.all().forEach(validateTextDocument);
});

function getDocumentSettings(resource: string): Thenable<ExtensionSettings> {
	if (!hasConfigurationCapability) {
		return Promise.resolve(globalSettings);
	}
	let result = documentSettings.get(resource);
	if (!result) {
		result = connection.workspace.getConfiguration({
			scopeUri: resource,
			section: 'snailLanguageServer'
		});
		documentSettings.set(resource, result);
	}

	return result;
}

// Only keep settings for open documents
documents.onDidClose(e => {
	documentSettings.delete(e.document.uri);
});

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(change => {
	validateTextDocument(change.document);
});

async function validateTextDocument(textDocument: TextDocument): Promise<void> {
	// TODO is there another way to do it?
	// In this simple example we get the settings for every validate run.
	const settings = await getDocumentSettings(textDocument.uri);

	// get path to snail from extension settings
	const snailPath = settings.snailPath;

	// run the current snail file and return error messages
	const text: string = textDocument.getText().replace(/\n/gm, "\n");

	// create temp dir and temp file
	const osTmpDir : string = os.tmpdir();
	const tmpDir: string = f.mkdtempSync(path.join(osTmpDir, "snail-lsp"));
	const filename: string = path.join(tmpDir, 'tmp.sl');
	f.writeFileSync(filename, text);
	
	try {

		const diagnostics: ls.Diagnostic[] = [];

		// run the snail file
		const snailPath = settings.snailPath;
		const child = cp.spawnSync( snailPath, ['-s', filename]);
		const err_msg = child.stdout.toString();

		// extract error information:
		const err_json = JSON.parse(err_msg);
		
		let problems = 0;
		if (err_json.status == 'ERROR' && problems < settings.maxNumberOfProblems) {
			problems++;
			const err_start = err_json.location.offset_start
			const err_end = err_json.location.offset_end
			const diagnostic: ls.Diagnostic = {
				severity: ls.DiagnosticSeverity.Error,
				range: {
					start: textDocument.positionAt(err_start),
					end: textDocument.positionAt(err_end)
				},
				message: err_json.message,
				source: "Snail " + err_json.type
			};
			diagnostics.push(diagnostic);
		}
	
		// Send the computed diagnostics to VSCode.
		connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
	} catch (e) {
		throw e;
	} finally {
		// remove our temporary directory
		f.rmSync(tmpDir, { recursive: true, force: true });
	}
	
}

connection.onDidChangeWatchedFiles(_change => {
	// Monitored files have change in VSCode
	connection.console.log('We received an file change event');
});

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
