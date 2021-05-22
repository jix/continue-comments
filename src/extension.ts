import { AssertionError } from 'assert';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('continue-comments.continueComment', () => {
		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			vscode.commands.executeCommand('type', { text: '\n' });
			return;
		}

		editor.edit(builder => {
			editor.selections.forEach(sel => {
				const line = editor.document.lineAt(sel.anchor);
				let match = line.text.match(/^\s*\/\*[* ]?/);
				if (match !== null) {
					builder.insert(sel.anchor, '\n' + match[0].replace('**', '* ').replace('/', ' '));
				} else {
					match = line.text.match(/^\s*(([*#;]|\/\/\S*) ?)?/);
					if (match === null) {
						throw new AssertionError({ message: "should always match" });
					}
					builder.insert(sel.anchor, '\n' + match[0]);
				}
			});
		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
