import { Location } from 'vscode';

declare global {
  type YmlItem = {
    value: string,
    location: Location
  };
}