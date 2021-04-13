import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { Parser } from '../../parser';

describe('Parser', function () {
  describe('.parse', function () {
    it('sample-1(Simple)', function () {
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
      console.log("expected", expected);
      console.log("result", result);
      assert.deepStrictEqual(result, expected);
    });
  });
});