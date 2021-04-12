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
  Uri,
  CompletionItemKind
} from 'vscode';
import { parse } from 'yaml';
import { Parser } from "./parser";
import { flattenDeep, isUndefined, isEmpty, compact, isNull } from 'lodash';


export async function activate(context: ExtensionContext) {
  let yamlItems: YamlItem[] = await parseYamlFiles();
  const completions = compact(yamlItems.map((i) => {
    try{
      // NOTE:
      // to work completion in string(e.g literal("xxx.yyy"))
      // Turn on setting editor.quickSuggestions: true
      // "editor.quickSuggestions": {
      //   ...
      //   "strings": true
      // }
      if(isEmpty(i.value) || isEmpty(i.key)){
        return null;
      }
  
      const completion = new CompletionItem(i.key, CompletionItemKind.Text);
      completion.documentation = new MarkdownString(i.value.toString());
      return completion;

    } catch(err) {
      return null;
    }
  }));

  // CompletionProvider
  const completionProvider = languages.registerCompletionItemProvider('javascript', {
    provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext) {
      return completions;
    }
  });

  // Definition
  const definitionProvider = languages.registerDefinitionProvider({ scheme: 'file', language: 'javascript' }, {
    provideDefinition(document: TextDocument, position: Position, token: CancellationToken) {
      try{
        // Read focused line
        const line = document.lineAt(position);

        // Try to extract yaml key with Regex
        // TODO: hanlde single quatation
        const result = line.text.match(/.*i18n.t\("(?<yamlKey>.*)"\).*/);
        const yamlKey = result?.groups?.yamlKey;
        // Return if not yamlKey
        if (isUndefined(yamlKey)) { 
          console.log("yamlKey not found", line.text);
          return; 
        }

        // Find corresponding yaml item by yamlKey
        const item = yamlItems.find((item) => item.key === yamlKey);
        // TODO: Showing no yaml key
        if (isUndefined(item)) { 
          console.log("item not found", yamlKey);
          return; }
  
        const range = new Range(new Position(item.lineNumber, 0), new Position(item.lineNumber, 0));
        const location = new Location(Uri.file(item.path), range);
        return location;
      } catch(err) {
        console.error("err", err);
      }
    }

  });
  console.log("yaml-X: Loaded");
  context.subscriptions.push(completionProvider, definitionProvider);
}

// TODO: トップのenやjaを落とす対応を落とす対応
const parseYamlFiles = async (): Promise<YamlItem[]> => {
  // Get WorkSpaceFolder
  const folder = workspace.workspaceFolders?.[0];
  if (!folder) { return []; }

  // List yml,yaml file uris in the folder
  const relativePath = new RelativePattern(folder, 'config/locales/**/*.{yml,yaml}');
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
  return compact(flattenDeep(items));
};

// this method is called when your extension is deactivated
export function deactivate() { }
