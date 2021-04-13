import { parse, LineCounter, parseDocument, YAMLMap, Pair, Scalar } from 'yaml';
import { flattenDeep } from 'lodash';

export class Parser {
  lineCounter: LineCounter = new LineCounter();
  constructor(readonly path: string) { }

  parse(rawYml: string): YamlItem[] {
    const contents = parseDocument(rawYml, { lineCounter: this.lineCounter }).contents as YAMLMap;
    const nodes = this.parseNode(contents);
    return flattenDeep(nodes);
  }

  /**
   * @param node 
   * @param parentKey 
   * @returns 
   */
  private parseNode(node: YAMLMap, parentKey: string | null = null): any[] {
    return node.items.map((item) => {
      if (item.value instanceof Scalar) {
        const key = parentKey !== null ? `${parentKey}.${(item.key as any).value}` : (item.key as any).value;
        return {
          key,
          value: item.value.value,
          lineNumber: this.findLineNumber(item.value),
          path: this.path
        };
      }
      if (item.value instanceof YAMLMap) {
        const key = (item.key as any).value;
        return [
          {
            key: parentKey ? `${parentKey}.${key}` : key,
            value: null,
            lineNumber: this.findLineNumber(item.key as any),
            path: this.path
          },
          this.parseNode(item.value, parentKey ? `${parentKey}.${key}` : key)];
      }
    });
  }

  private findLineNumber(value: Scalar) {
    const valueStartPosition = value.range![0];
    const lineStarts = this.lineCounter.lineStarts;
    const lineNumber = lineStarts.findIndex((l) => l > valueStartPosition);
    return lineNumber === -1 ? lineStarts.length - 1 : lineNumber - 1;
  }
}