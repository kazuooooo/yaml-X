import { Location, Uri, ExtensionContext, Position, CancellationToken, TextDocument, languages, Range, WorkspaceFolder, workspace, RelativePattern, FileSystem } from 'vscode';
import { parse } from 'yaml';
import { Parser } from "./parser";
import { flattenDeep } from 'lodash';


export async function activate(context: ExtensionContext) {
  let yamlItems: YamlItem[] = await parseYamlFiles();
  console.log(yamlItems);
  // return Parser.parse();
  // languages.registerDefinitionProvider({ scheme: 'file', language: 'javascript' }, {
  //   provideDefinition(document: TextDocument, position: Position, token: CancellationToken) {
  //   }
  // });
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
