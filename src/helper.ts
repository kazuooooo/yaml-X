import {
  Position,
  TextDocument,
  workspace
} from 'vscode';

export const excludeTopKey = (key: string): string => {
  return key.replace(/^.*?\./, "");
};

export const extractYamlKeyOfCurrentLine = (document: TextDocument, position: Position): string | undefined => {
  const config = workspace.getConfiguration("yaml-X");
  // Read focused line
  const line = document.lineAt(position);

  // Try to extract yaml key with Regex
  const regex = `.*${config.yamlKeyArgFunction}\\((\"|\'|\`)(?<yamlKey>.*)(\"|\'|\`)\\).*`;
  const result = line.text.match(regex);
  const yamlKey = result?.groups?.yamlKey;
  return yamlKey;
};