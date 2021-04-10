import {
  ExtensionContext,
  Position,
  CancellationToken,
  TextDocument,
  languages,
  workspace,
  RelativePattern,
  CompletionItem,
  CompletionContext,
  MarkdownString,
  Location,
  Range,
  Uri
} from 'vscode';
import { parse } from 'yaml';
import { Parser } from "./parser";
import { flattenDeep, isUndefined } from 'lodash';


export async function activate(context: ExtensionContext) {
  let yamlItems: YamlItem[] = await parseYamlFiles();

  // CompletionProvider
  const completionProvider = languages.registerCompletionItemProvider('javascript', {
    provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext) {
      const completions = yamlItems.map((i) => {
        // NOTE:
        // to work completion in string literal("xxx.yyy")
        // Turn on setting editor.quickSuggestions: true
        // "editor.quickSuggestions": {
        //   ...
        //   "strings": true
        // }
        const completion = new CompletionItem(i.key);
        completion.documentation = new MarkdownString(i.value);
        return completion;
      });
      const completion = new CompletionItem("\"nyanko\"");
      return [...completions, completion];
    }
  });

  // Definition
  const definitionProvider = languages.registerDefinitionProvider({ scheme: 'file', language: 'javascript' }, {
    provideDefinition(document: TextDocument, position: Position, token: CancellationToken) {
      // Read focused line
      const line = document.lineAt(position);

      // Try to extract yaml key with Regex
      const result = line.text.match(/.*i18n.t\("(?<yamlKey>.*)"\).*/);
      const yamlKey = result?.groups?.yamlKey;
      // Return if not yamlKey
      if (isUndefined(yamlKey)) { return; }

      // Find corresponding yaml item by yamlKey
      const item = yamlItems.find((item) => item.key === yamlKey);

      // TODO: Showing no yaml key
      if (isUndefined(item)) { return; }

      const range = new Range(new Position(item.lineNumber, 0), new Position(item.lineNumber, 0));
      const location = new Location(Uri.file(item.path), range);
      return location;
    }
  });

  context.subscriptions.push(completionProvider, definitionProvider);
}

const parseYamlFiles = async (): Promise<YamlItem[]> => {
  // Get WorkSpaceFolder
  const folder = workspace.workspaceFolders?.[0];
  if (!folder) { return []; }

  // List yml,yaml file uris in the folder
  const relativePath = new RelativePattern(folder, '**/*.{yml,yaml}');
  const uris = await workspace.findFiles(relativePath);

  // Parse yaml files to YamlItems
  const items = await Promise.all(
    uris.map(async (uri) => {
      const rawData = await workspace.fs.readFile(uri);
      const stringData = Buffer.from(rawData).toString('utf8');
      const items = new Parser(uri.path).parse(stringData);
      return items;
    })
  );
  return flattenDeep(items);
};

// this method is called when your extension is deactivated
export function deactivate() { }
