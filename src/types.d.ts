import { Location } from 'vscode';

declare global {
  type YamlItem = {
    key: string,
    value: string | null,
    lineNumber: number,
    path: string
  };
}