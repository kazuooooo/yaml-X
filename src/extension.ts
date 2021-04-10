import { Location, Uri, ExtensionContext, Position, CancellationToken, TextDocument, languages, Range } from 'vscode';


export function activate(context: ExtensionContext) {
  languages.registerDefinitionProvider({ scheme: 'file', language: 'javascript' }, {
    provideDefinition(document: TextDocument, position: Position, token: CancellationToken) {
      return item.location;
    }
  });
}

// this method is called when your extension is deactivated
export function deactivate() { }
