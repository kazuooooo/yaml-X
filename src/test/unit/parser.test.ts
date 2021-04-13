import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { Parser } from '../../parser';

describe('Parser', function () {
  describe('.parse', function () {
    it('basic.yaml', function () {
      // Prepare
      const filePath = path.resolve(__dirname, "../../../sample-yml/basic.yaml");
      const yml = fs.readFileSync(filePath, 'utf8');

      // Execute
      const result = new Parser(filePath).parse(yml);

      // Evaluate
      const expected: YamlItem[] = [
        {
          key: "hoge",
          value: null,
          lineNumber: 1,
          path: filePath
        },
        {
          key: "hoge.baz",
          value: "Baz",
          lineNumber: 2,
          path: filePath
        },
        {
          key: "hoge.foo",
          value: "Foo",
          lineNumber: 3,
          path: filePath
        }
      ];
      assert.deepStrictEqual(result, expected);
    });
    it('nested.yaml', function () {
      // Prepare
      const filePath = path.resolve(__dirname, "../../../sample-yml/nested.yaml");
      const yml = fs.readFileSync(filePath, 'utf8');

      // Execute
      const result = new Parser(filePath).parse(yml);

      // Evaluate
      const expected: YamlItem[] = [
        {
          key: "hoge",
          value: null,
          lineNumber: 1,
          path: filePath
        },
        {
          key: "hoge.baz",
          value: null,
          lineNumber: 2,
          path: filePath
        },
        {
          key: "hoge.baz.foo",
          value: "Foo",
          lineNumber: 3,
          path: filePath
        }
      ];
      assert.deepStrictEqual(result, expected);
    });
    it('multiRoot.yaml', function () {
      // Prepare
      const filePath = path.resolve(__dirname, "../../../sample-yml/multiRoot.yaml");
      const yml = fs.readFileSync(filePath, 'utf8');

      // Execute
      const result = new Parser(filePath).parse(yml);

      // Evaluate
      const expected: YamlItem[] = [
        {
          key: "hoge",
          value: null,
          lineNumber: 1,
          path: filePath
        },
        {
          key: "hoge.baz",
          value: "Baz",
          lineNumber: 2,
          path: filePath
        },
        {
          key: "piyo",
          value: null,
          lineNumber: 3,
          path: filePath
        },
        {
          key: "piyo.foo",
          value: "Foo",
          lineNumber: 4,
          path: filePath
        }
      ];
      assert.deepStrictEqual(result, expected);
    });
  });
});